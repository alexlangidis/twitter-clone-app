"use client";

import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { Camera } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
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
    };
  };
};

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
}: EditProfileModalProps) {
  const [banner, setBanner] = useState<string | null>(user.image || null);
  const [avatar, setAvatar] = useState<string | null>(user.image || null);
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio || "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form className="space-y-6">
          <div className="relative">
            <div className="h-32 bg-linear-to-r from-blue-400 to-purple-500 relative rounded-lg overflow-hidden">
              {banner && (
                <Image
                  src={banner}
                  alt="banner"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <input
              ref={bannerInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              id="image-upload"
              onChange={() => {}}
            />
            <Button
              variant={"ghost"}
              type="button"
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 hover:text-white"
              onClick={() => bannerInputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-4 -mt-16 ml-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={user.avatar ?? undefined} />
                <AvatarFallback className="text-xl">
                  {" "}
                  {getInitials(user.name)}{" "}
                </AvatarFallback>
              </Avatar>

              <input
                ref={avatarInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                id="image-upload"
                onChange={() => {}}
              />
              <Button
                variant={"ghost"}
                type="button"
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 hover:text-white"
                onClick={() => avatarInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                maxLength={50}
                required
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2"
              >
                Username
              </label>
              <Input
                id="username"
                name="username"
                value={formData.username ?? ""}
                onChange={handleInputChange}
                placeholder="Enter your username"
                maxLength={30}
                required
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-2">
                Bio
              </label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio ?? ""}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                maxLength={160}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant={"outline"} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
