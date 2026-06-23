"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { redirect } from "next/navigation";
import path from "path";
import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth-actions";
import { prisma } from "../prisma";

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

    return { success: true, tweet: reply };
  } catch (error) {
    console.log("Error creating reply", error);
    return { success: false, error: "Failed to reply" };
  }
}

export async function getTweetById(tweetId: string) {
  try {
    const tweet = await prisma.tweet.findUnique({
      where: {
        id: tweetId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    if (!tweet) {
      return { success: false, error: "Tweet not found!" };
    }

    return { success: true, tweet };
  } catch (error) {
    console.log("Error getting tweet", error);
    return { success: false, error: "Failed to fetch tweet" };
  }
}

export async function getTweetReplies(tweetId: string) {
  try {
    const replies = await prisma.tweet.findMany({
      where: {
        parentId: tweetId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    return { success: true, replies };
  } catch (error) {
    console.log("Error getting tweet replies", error);
    return { success: false, error: "Failed to fetch tweet replies" };
  }
}

export async function getTweets() {
  try {
    const tweets = await prisma.tweet.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, tweets };
  } catch (error) {
    console.log("Error fetching tweets", error);
    return { success: false, error: "Failed to fetch tweets" };
  }
}
