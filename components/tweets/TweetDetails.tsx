"use client";

import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Tweet from "./Tweet";

type TweetDetailsProps = {
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
    likes: Array<{ id: string; userId: string }>;
  };
  replies: Array<{
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
    likes: Array<{ id: string; userId: string }>;
  }>;
  currentUserId?: string;
};

export default function TweetDetails({
  tweet,
  replies,
  currentUserId,
}: TweetDetailsProps) {
  const router = useRouter();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center p-4 border-b border-border">
        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <h1 className="text-xl font-bold">Tweet</h1>
        </Button>
      </div>
      <Tweet tweet={tweet} currentUserId={currentUserId} />

      <div className="divide-y divide-border">
        {replies.map((reply, key) => (
          <Tweet tweet={reply} currentUserId={currentUserId} key={key} />
        ))}

        {replies.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No replies yet. Be the first to reply!</p>
          </div>
        )}
      </div>
    </div>
  );
}
