"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import path from "path";
import { requireUser } from "../auth/require-user";
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

type ProfileImageType = "avatar" | "banner";

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

async function saveProfileImage(image: File, type: ProfileImageType) {
  if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
    throw new Error("Unsupported image type");
  }

  if (image.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be 5MB or smaller");
  }

  const extension = IMAGE_EXTENSIONS[image.type];
  const fileName = `${type}-${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles");
  const filePath = path.join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, Buffer.from(await image.arrayBuffer()));

  return `/uploads/profiles/${fileName}`;
}

export async function uploadProfileImage(
  type: ProfileImageType,
  formData: FormData,
) {
  const user = await requireUser();

  try {
    const image = formData.get("image");

    if (!(image instanceof File) || image.size === 0) {
      return { success: false, error: "Please choose an image" };
    }

    const imageUrl = await saveProfileImage(image, type);

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: type === "avatar" ? { avatar: imageUrl } : { image: imageUrl },
      select: {
        username: true,
      },
    });

    if (updatedUser.username) {
      revalidatePath(`/profile/${updatedUser.username}`);
    }

    return { success: true, imageUrl };
  } catch (error) {
    console.error("Error uploading profile image:", error);

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Failed to upload image" };
  }
}

export async function updateProfile(formData: FormData) {
  const user = await requireUser();

  try {
    const name = formData.get("name");
    const username = formData.get("username");
    const bio = formData.get("bio");

    if (typeof name !== "string" || !name.trim()) {
      return { success: false, error: "Name is required" };
    }

    if (name.trim().length > 50) {
      return { success: false, error: "Name must be 50 characters or fewer" };
    }

    if (typeof username !== "string" || !username.trim()) {
      return { success: false, error: "Username is required" };
    }

    const normalizedUsername = username.trim().replace(/^@+/, "");

    if (normalizedUsername.length > 30) {
      return {
        success: false,
        error: "Username must be 30 characters or fewer",
      };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(normalizedUsername)) {
      return {
        success: false,
        error: "Username can only use letters, numbers, and underscores",
      };
    }

    if (typeof bio !== "string") {
      return { success: false, error: "Invalid bio" };
    }

    if (bio.length > 160) {
      return { success: false, error: "Bio must be 160 characters or fewer" };
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        username: true,
      },
    });

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: name.trim(),
        username: normalizedUsername,
        bio: bio.trim() || null,
      },
      select: {
        username: true,
      },
    });

    if (currentUser?.username) {
      revalidatePath(`/profile/${currentUser.username}`);
    }

    revalidatePath(`/profile/${updatedUser.username}`);
    revalidatePath("/");

    return { success: true, username: updatedUser.username };
  } catch (error) {
    console.error("Error updating profile:", error);

    if (isUniqueConstraintError(error)) {
      return { success: false, error: "Username is already taken" };
    }

    return { success: false, error: "Failed to update profile" };
  }
}

export async function getUserTweets(username: string) {
  try {
    const tweets = await prisma.tweet.findMany({
      where: {
        parentId: null,
        author: {
          username,
        },
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
      },
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
