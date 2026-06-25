"use client";

import { updateProfile } from "@/lib/actions/profile";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProfileSetupFormProps = {
  name: string;
  username: string;
};

export default function ProfileSetupForm({
  name,
  username,
}: ProfileSetupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name,
    username,
    bio: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("username", formData.username);
      data.append("bio", formData.bio);

      const result = await updateProfile(data);

      if (!result.success || !result.username) {
        setError(result.error ?? "Failed to update profile");
        return;
      }

      router.push(`/profile/${result.username}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="choose-a-username"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Continue"}
      </Button>
    </form>
  );
}
