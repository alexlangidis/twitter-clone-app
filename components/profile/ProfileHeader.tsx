"use client";

import { getInitials } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Calendar, Edit } from "lucide-react";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import { toggleFollow } from "@/lib/actions/profile";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type ProfileHeaderProps = {
  user: {
    id: string;
    name: string;
    username: string;
    bio?: string | null;
    avatar?: string | null;
    image?: string | null;
    createdAt: Date;
    _count: {
      tweets: number;
      following: number;
      followers: number;
    };
    isFollowing?: boolean;
  };
  currentUser: {
    id: string;
  };
};

export default function ProfileHeader({
  user,
  currentUser,
}: ProfileHeaderProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const router = useRouter();

  const isOwnProfile = currentUser.id === user.id;

  async function handleFollow() {
    if (isFollowLoading) {
      return;
    }

    setIsFollowLoading(true);

    try {
      const result = await toggleFollow(user.id);

      if (!result.success) {
        toast.error(result.error ?? "Failed to update follow");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating follow:", error);
      toast.error("Failed to update follow");
    } finally {
      setIsFollowLoading(false);
    }
  }

  function formatJoinDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  }

  return (
    <div className="border-b border-border">
      <div className="h-48 bg-linear-to-r from-blue-400 to-purple-500 relative">
        {user.image ? (
          <Image
            src={user.image}
            alt="banner"
            width={800}
            height={192}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-48 bg-linear-to-r from-blue-400 to-purple-500" />
        )}
      </div>

      {/* profile info */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-center -mt-16 mb-8">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar ?? undefined} />
            <AvatarFallback> {getInitials(user.name)} </AvatarFallback>
          </Avatar>

          {isOwnProfile ? (
            <Button
              variant={"outline"}
              className="z-2"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <Button
              variant={user.isFollowing ? "default" : "outline"}
              className="z-2 "
              disabled={isFollowLoading}
              onClick={handleFollow}
            >
              {user.isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        {/* user details */}
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          {user.bio && <p className="text-foreground">{user.bio}</p>}

          <div className="flex items-center space-x-4 text-muted-foreground text-sm">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {formatJoinDate(user.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-foreground">
                {user._count.following}
              </span>
              <span className="text-muted-foreground">Following</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-foreground">
                {user._count.followers}
              </span>
              <span className="text-muted-foreground">Followers</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-foreground">
                {user._count.tweets}
              </span>
              <span className="text-muted-foreground">Tweets</span>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
    </div>
  );
}
