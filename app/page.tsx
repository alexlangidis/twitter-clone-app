import MainLayout from "@/components/MainLayout";
import Tweet from "@/components/tweets/Tweet";
import TweetComposer from "@/components/tweets/TweetComposer";
import { requireUser } from "@/lib/auth/require-user";
import { getTweets } from "@/lib/data/tweets";

export default async function Home() {
  const user = await requireUser();
  const tweetsResult = await getTweets();
  const tweets = tweetsResult.success ? tweetsResult.tweets || [] : [];

  return (
    <MainLayout>
      <div className="border-b border-border ">
        <div className="p-4">
          <h1 className="text-xl font-bold">Home</h1>
        </div>
      </div>

      {/* twitter composer  */}

      <TweetComposer user={user} />

      {/* twitter feed */}

      <div className="divide-y divide-border">
        {tweets.length > 0 ? (
          tweets.map((tweet, key) => (
            <Tweet key={key} tweet={tweet} currentUserId={user.id} />
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>No tweets yet. Be the first to tweet!</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
