import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/lib/prisma";
import { profileTag, userTweetsTag } from "./cache-tags";

const userTweetInclude = {
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

export async function getUserTweets(username: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(userTweetsTag(username));

  try {
    const tweets = await prisma.tweet.findMany({
      where: {
        parentId: null,
        author: {
          username,
        },
      },
      include: userTweetInclude,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, tweets };
  } catch (error) {
    console.error("Error fetching user tweets:", error);
    return { success: false, error: "Failed to fetch user tweets" };
  }
}

export async function getUserProfile(username: string, currentUserId?: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(profileTag(username));

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        _count: {
          select: {
            tweets: true,
            likes: true,
            retweets: true,
            following: true,
            followers: true,
          },
        },
        followers: currentUserId
          ? {
              where: {
                followerId: currentUserId,
              },
              select: {
                id: true,
              },
            }
          : false,
      },
    });

    if (!user) {
      return { success: false, error: "User not found!" };
    }

    const [postsCount, repliesCount] = await Promise.all([
      prisma.tweet.count({
        where: {
          authorId: user.id,
          parentId: null,
        },
      }),
      prisma.tweet.count({
        where: {
          authorId: user.id,
          parentId: { not: null },
        },
      }),
    ]);

    return {
      success: true,
      user: {
        ...user,
        postsCount,
        repliesCount,
        isFollowing: currentUserId ? user.followers.length > 0 : false,
      },
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: "Failed to fetch user profile" };
  }
}
