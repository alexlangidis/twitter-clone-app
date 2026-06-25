"use server";

import { requireUser } from "../auth/require-user";
import { NotificationType } from "../generated/prisma/enums";
import { prisma } from "../prisma";

export async function getNotifications() {
  const user = await requireUser();
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: user.id,
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        tweet: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, notifications };
  } catch (error) {
    console.log("Error fetching notification", error);
    return { success: false, error: "Failed to fetch notification" };
  }
}

export async function getUnreadNotificationCount() {
  const user = await requireUser();

  try {
    const count = await prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    });

    return { success: true, count };
  } catch (error) {
    console.log("Error fetching unread notification count", error);
    return { success: false, error: "Failed to fetch unread notification count" };
  }
}

export async function markAllNotificationsAsRead() {
  const user = await requireUser();

  try {
    await prisma.notification.updateMany({
      where: {
        recipientId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.log("Error marking notifications as read", error);
    return { success: false, error: "Failed to mark notifications as read" };
  }
}

export async function createNotification(
  type: NotificationType,
  recipientId: string,
  actorId: string,
  tweetId?: string,
) {
  try {
    if (actorId === recipientId) {
      return { success: true };
    }

    const existingNotification = await prisma.notification.findFirst({
      where: {
        type,
        recipientId,
        actorId,
        tweetId: tweetId ?? null,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existingNotification) {
      return { success: true };
    }

    await prisma.notification.create({
      data: {
        type,
        recipientId,
        actorId,
        tweetId: tweetId ?? null,
      },
    });
    return { success: true };
  } catch (error) {
    console.log("Error creating notification", error);
    return { success: false, error: "Failed to create notification" };
  }
}
