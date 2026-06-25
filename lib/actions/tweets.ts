"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { redirect } from "next/navigation";
import path from "path";
import { revalidatePath, updateTag } from "next/cache";
import { getSession } from "../auth/auth-actions";
import { prisma } from "../prisma";
import { requireUser } from "../auth/require-user";
import { createNotification } from "./notification";
import {
  TWEETS_TAG,
  tweetRepliesTag,
  tweetTag,
  userTweetsTag,
} from "../data/cache-tags";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function updateTweetReadTags(tweet: {
  id: string;
  parentId: string | null;
  author: { username: string | null };
}) {
  updateTag(TWEETS_TAG);
  updateTag(tweetTag(tweet.id));

  if (tweet.author.username) {
    updateTag(userTweetsTag(tweet.author.username));
  }

  if (tweet.parentId) {
    updateTag(tweetRepliesTag(tweet.parentId));
  }
}

async function saveTweetImage(image: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
    throw new Error("Unsupported image type");
  }

  if (image.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be 5MB or smaller");
  }

  const extension = IMAGE_EXTENSIONS[image.type];
  const fileName = `${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "tweets");
  const filePath = path.join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, Buffer.from(await image.arrayBuffer()));

  return `/uploads/tweets/${fileName}`;
}

export async function createTweet(formData: FormData) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  try {
    const content = formData.get("content");
    const image = formData.get("image");

    if (typeof content !== "string" || !content.trim()) {
      return { success: false, error: "Tweet content is required" };
    }

    let imageUrl: string | null = null;

    if (image instanceof File && image.size > 0) {
      imageUrl = await saveTweetImage(image);
    }

    const tweets = await prisma.tweet.create({
      data: {
        content: content.trim(),
        imageUrl,
        authorId: session.user.id,
      },
    });

    updateTag(TWEETS_TAG);
    if (session.user.username) {
      updateTag(userTweetsTag(session.user.username));
    }
    revalidatePath("/");

    return { success: true, tweets };
  } catch (error) {
    console.log("Error creating tweet", error);
    return { success: false, error: "Failed to tweet" };
  }
}

export async function createReply(parentId: string, formData: FormData) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  try {
    const content = formData.get("content");
    const image = formData.get("image");

    if (typeof content !== "string" || !content.trim()) {
      return { success: false, error: "Reply content is required" };
    }

    let imageUrl: string | null = null;

    if (image instanceof File && image.size > 0) {
      imageUrl = await saveTweetImage(image);
    }

    const reply = await prisma.tweet.create({
      data: {
        content: content.trim(),
        imageUrl,
        authorId: session.user.id,
        parentId,
      },
    });

    revalidatePath("/");
    revalidatePath(`/tweet/${parentId}`);

    const originalTweet = await prisma.tweet.findUnique({
      where: {
        id: parentId,
      },
      select: {
        authorId: true,
      },
    });

    if (originalTweet) {
      await createNotification(
        "REPLY",
        originalTweet.authorId,
        session.user.id,
        parentId,
      );
    }

    updateTag(TWEETS_TAG);
    updateTag(tweetTag(parentId));
    updateTag(tweetRepliesTag(parentId));
    if (session.user.username) {
      updateTag(userTweetsTag(session.user.username));
    }
    return { success: true, tweet: reply };
  } catch (error) {
    console.log("Error creating reply", error);
    return { success: false, error: "Failed to reply" };
  }
}

export async function likeTweet(tweetId: string) {
  const user = await requireUser();
  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_tweetId: {
          userId: user.id,
          tweetId,
        },
      },
    });

    if (existingLike) {
      const tweet = await prisma.tweet.findUnique({
        where: {
          id: tweetId,
        },
        select: {
          id: true,
          parentId: true,
          author: {
            select: {
              username: true,
            },
          },
        },
      });

      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      if (tweet) {
        updateTweetReadTags(tweet);
      }

      return { success: true, action: "unlike" };
    } else {
      await prisma.like.create({
        data: {
          userId: user.id,
          tweetId,
        },
      });

      //create notification

      const tweet = await prisma.tweet.findUnique({
        where: {
          id: tweetId,
        },
        select: {
          id: true,
          authorId: true,
          parentId: true,
          author: {
            select: {
              username: true,
            },
          },
        },
      });

      if (tweet) {
        await createNotification("LIKE", tweet.authorId, user.id, tweetId);
        updateTweetReadTags(tweet);
      }

      return { success: true, action: "like" };
    }
  } catch (error) {
    console.log("Error getting tweet", error);
    return { success: false, error: "Failed to fetch tweet" };
  }
}

export async function retweetTweet(tweetId: string) {
  const user = await requireUser();

  try {
    const existingRetweet = await prisma.retweet.findUnique({
      where: {
        userId_tweetId: {
          userId: user.id,
          tweetId,
        },
      },
    });

    if (existingRetweet) {
      const tweet = await prisma.tweet.findUnique({
        where: {
          id: tweetId,
        },
        select: {
          id: true,
          parentId: true,
          author: {
            select: {
              username: true,
            },
          },
        },
      });

      await prisma.retweet.delete({
        where: {
          id: existingRetweet.id,
        },
      });

      if (tweet) {
        updateTweetReadTags(tweet);
      }

      revalidatePath("/");
      revalidatePath(`/tweet/${tweetId}`);

      return { success: true, action: "unretweet" };
    }

    await prisma.retweet.create({
      data: {
        userId: user.id,
        tweetId,
      },
    });

    revalidatePath("/");
    revalidatePath(`/tweet/${tweetId}`);

    const tweet = await prisma.tweet.findUnique({
      where: {
        id: tweetId,
      },
      select: {
        id: true,
        authorId: true,
        parentId: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    if (tweet) {
      await createNotification("RETWEET", tweet.authorId, user.id, tweetId);
      updateTweetReadTags(tweet);
    }

    return { success: true, action: "retweet" };
  } catch (error) {
    console.log("Error retweeting tweet", error);
    return { success: false, error: "Failed to retweet" };
  }
}
