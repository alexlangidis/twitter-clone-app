"use client";

import { useState } from "react";
import Tweet from "../tweets/Tweet";
import ProfileTabs from "./ProfileTabs";

type TweetWithRelations = {
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
  retweets: Array<{ id: string; userId: string }>;
};

type ProfileContentProps = {
  username: string;
  initialTweets: TweetWithRelations[];
  tweetCount: number;
  replyCount: number;
  likeCount: number;
  retweetCount: number;
  currentUserId?: string;
};

export default function ProfileContent({
  username,
  initialTweets,
  tweetCount,
  replyCount,
  likeCount,
  retweetCount,
  currentUserId,
}: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState("posts");
  const [tweets, setTweets] = useState(initialTweets);
  const tabLabels: Record<string, string> = {
    posts: "Posts",
    replies: "Replies",
    likes: "Likes",
    retweets: "Retweets",
  };

  function handleTabChange(tab: string) {
    setActiveTab(tab);
    setTweets(tab === "posts" ? initialTweets : []);
  }

  return (
    <div>
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tweetCount={tweetCount}
        replyCount={replyCount}
        likeCount={likeCount}
        retweetCount={retweetCount}
      />

      {tweets.length > 0 ? (
        tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} currentUserId={currentUserId} />
        ))
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          <p>
            {activeTab === "posts"
              ? `@${username} has not posted yet.`
              : `${tabLabels[activeTab]} will show here.`}
          </p>
        </div>
      )}
    </div>
  );
}
