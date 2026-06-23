import TweetDetails from "@/components/tweets/TweetDetails";
import { getTweetById, getTweetReplies } from "@/lib/actions/tweets";
import { requireUser } from "@/lib/auth/require-user";
import { redirect } from "next/navigation";

export default async function TweetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const paramsResolved = await params;
  const id = paramsResolved.id;

  const tweetResult = await getTweetById(id);

  if (!tweetResult.success || !tweetResult.tweet) {
    redirect("/");
  }

  const repliesResult = await getTweetReplies(id);

  return (
    <TweetDetails
      tweet={tweetResult.tweet}
      replies={repliesResult.replies ?? []}
      currentUserId={user.id}
    />
  );
}
