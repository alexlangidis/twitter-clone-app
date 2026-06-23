"use client";
import { formatTimeAgo, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import TweetComposer from "./TweetComposer";

type TweetProps = {
  tweet: {
    id: string;
    content: string;
    imageUrl: string | null;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      username: string | null;
      avatar?: string | null;
    };
    _count?: {
      replies: number;
    };
  };
  currentUserId?: string;
};

export default function Tweet({ tweet }: TweetProps) {
  const [showReplyComposer, setShowReplyComposer] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleReply() {
    if (pathname === "/") {
      router.push(`/tweet/${tweet.id}`);
    } else {
      setShowReplyComposer((prev) => !prev);
    }
  }

  function handleCreateReply() {
    setShowReplyComposer(false);
  }

  return (
    <>
      <Link
        href={`/tweet/${tweet.id}`}
        className="p-4 hover:bg-muted/50 cursor-pointer border-b border-border"
      >
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={tweet.author.avatar ?? undefined} />
            <AvatarFallback> {getInitials(tweet.author.name)} </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{tweet.author.name}</span>
              <span className="text-muted-foreground">
                {tweet.author.username}
              </span>
              <span className="text-muted-foreground">.</span>
              <span className="text-muted-foreground">
                {formatTimeAgo(tweet.createdAt)}
              </span>
            </div>
            <p className="text-foreground whitespace-pre-wrap">
              {tweet.content}
            </p>

            {tweet.imageUrl && (
              <div className="overflow-hidden rounded-2xl border border-border">
                <Image
                  src={tweet.imageUrl}
                  alt="Tweet image"
                  width={600}
                  height={400}
                  className="max-h-96 w-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center space-x-6 text-muted-foreground">
              <Button
                variant={"ghost"}
                className="flex items-center space-x-2 hover:text-primary"
                onClick={handleReply}
              >
                <MessageCircle className="h-4 w-4" />
                <span>{tweet._count?.replies ?? 0}</span>
              </Button>

              <Button
                variant={"ghost"}
                className="flex items-center space-x-2 hover:text-green-500"
              >
                <Repeat2 className="h-4 w-4" /> <span>{2}</span>
              </Button>

              <Button
                variant={"ghost"}
                className="flex items-center space-x-2 hover:text-red-500"
              >
                <Heart className="h-4 w-4" /> <span>{2}</span>
              </Button>

              <Button
                variant={"ghost"}
                className="flex items-center space-x-2 hover:text-primary"
              >
                <Share className="h-4 w-4" /> <span>{2}</span>
              </Button>
            </div>
          </div>
        </div>
      </Link>

      {showReplyComposer && (
        <div className="p-4 border-b border-border">
          <TweetComposer
            parentId={tweet.id}
            placeholder="Tweet your reply..."
            onSubmit={handleCreateReply}
            onCancel={() => setShowReplyComposer(false)}
          />
        </div>
      )}
    </>
  );
}
