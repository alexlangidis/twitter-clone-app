"use server";

import { prisma } from "../prisma";

export async function getUserProfile(username: string) {
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
          },
        },
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
      },
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: "Failed to fetch user profile" };
  }
}
