"use client";

import { SessionUser } from "@/lib/auth";
import { getInitials } from "@/lib/utils";
import { AvatarImage, AvatarFallback, Avatar } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { createReply, createTweet } from "@/lib/actions/tweets";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type TweetComposerProps = {
  user?: SessionUser;
  parentId?: string;
  placeholder?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
};

export default function TweetComposer({
  user,
  parentId,
  placeholder = "What's Happening",
  onSubmit,
  onCancel,
}: TweetComposerProps) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function clearSelectedImage() {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setSelectedImage(null);
    setImagePreviewUrl(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5MB or smaller");
      e.target.value = "";
      return;
    }

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setSelectedImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!content.trim() || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("content", content.trim());

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const result = parentId
        ? await createReply(parentId, formData)
        : await createTweet(formData);

      if (result.success) {
        setContent("");
        clearSelectedImage();
        onSubmit?.();
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to create tweet");
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
                  ref={imageInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  id="image-upload"
                  onChange={handleImageChange}
                />
                <Button
                  variant={"ghost"}
                  type="button"
                  className="text-blue-500 hover:text-blue-600 p-2"
                  disabled={isLoading}
                  onClick={() => imageInputRef.current?.click()}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  {content.length}/280
                </span>

                {onCancel && (
                  <Button
                    type="button"
                    variant={"outline"}
                    className="rounded-full px-6"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  type="submit"
                  className="rounded-full px-6"
                  disabled={
                    !content.trim() || content.length > 280 || isLoading
                  }
                >
                  {isLoading ? "Tweeting..." : "Tweet"}
                </Button>
              </div>
            </div>

            {imagePreviewUrl && (
              <div className="relative overflow-hidden rounded-2xl border border-border">
                <Image
                  src={imagePreviewUrl}
                  alt="Selected upload preview"
                  width={600}
                  height={400}
                  className="max-h-80 w-full object-cover"
                  unoptimized
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full"
                  onClick={clearSelectedImage}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
