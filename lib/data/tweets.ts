import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/lib/prisma";
import { tweetRepliesTag, tweetTag, TWEETS_TAG } from "./cache-tags";

const tweetInclude = {
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
  likes: {
    select: {
      id: true,
      userId: true,
    },
  },
  retweets: {
    select: {
      id: true,
      userId: true,
    },
  },
};

export async function getTweetById(tweetId: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(tweetTag(tweetId));

  try {
    const tweet = await prisma.tweet.findUnique({
      where: {
        id: tweetId,
      },
      include: tweetInclude,
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
  "use cache";
  cacheLife("minutes");
  cacheTag(tweetRepliesTag(tweetId));

  try {
    const replies = await prisma.tweet.findMany({
      where: {
        parentId: tweetId,
      },
      include: tweetInclude,
    });

    return { success: true, replies };
  } catch (error) {
    console.log("Error getting tweet replies", error);
    return { success: false, error: "Failed to fetch tweet replies" };
  }
}

export async function getTweets() {
  "use cache";
  cacheLife("minutes");
  cacheTag(TWEETS_TAG);

  try {
    const tweets = await prisma.tweet.findMany({
      include: tweetInclude,
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
