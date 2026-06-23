"use client";

import { SessionUser } from "@/lib/auth";
import { getInitials } from "@/lib/utils";
import { AvatarImage, AvatarFallback, Avatar } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { createTweet } from "@/lib/actions/tweets";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type TweetComposerProps = {
  user?: SessionUser;
  placeholder?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
};

export default function TweetComposer({
  user,
  placeholder = "What's Happening",
  onSubmit,
  onCancel,
}: TweetComposerProps) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!content.trim() || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await createTweet(content.trim());
      if (result) {
        setContent("");
        router.refresh();
      } else {
        toast.error("Failed to create tweet");
      }
    } catch {
      toast.error("Failed to create tweet");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="border-b border-border p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex min-w-0 space-x-3">
          {user && (
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar ?? undefined} />
              <AvatarFallback> {getInitials(user?.name ?? "")} </AvatarFallback>
            </Avatar>
          )}
          <div className="min-w-0 flex-1 space-y-3">
            <Textarea
              placeholder={placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="field-sizing-fixed min-h-25 max-w-full resize-none border-0 text-lg placeholder:text-muted-foreground focus-visible:ring-1"
              maxLength={280}
            />

            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <input
                  type="file"
                  className="hidden"
                  accept="images/*"
                  id="image-upload"
                />
                <Button
                  variant={"ghost"}
                  type="button"
                  className="text-blue-500 hover:text-blue-600 p-2"
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  {content.length}/280
                </span>

                {/* reply */}

                <Button
                  type="submit"
                  className="rounded-full px-6"
                  disabled={!content.trim() || content.length > 280}
                >
                  Tweet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
