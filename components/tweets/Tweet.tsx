import { formatTimeAgo } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";

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
  };
  currentUserId?: string;
};

export default function Tweet({ tweet, currentUserId }: TweetProps) {
  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div className="p-4 hover:bg-muted/50 cursor-pointer border-b border-border">
      <div className="flex space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={tweet.author.avatar ?? ""} />
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
          <p className="text-foreground whitespace-pre-wrap">{tweet.content}</p>

          {/* images */}

          <div className="flex items-center space-x-6 text-muted-foreground">
            <Button
              variant={"ghost"}
              className="flex items-center space-x-2 hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" /> <span>{2}</span>
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
    </div>
  );
}
