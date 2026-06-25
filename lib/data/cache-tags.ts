export const TWEETS_TAG = "tweets";

export function tweetTag(tweetId: string) {
  return `tweet:${tweetId}`;
}

export function tweetRepliesTag(tweetId: string) {
  return `tweet-replies:${tweetId}`;
}

export function profileTag(username: string) {
  return `profile:${username}`;
}

export function userTweetsTag(username: string) {
  return `user-tweets:${username}`;
}
