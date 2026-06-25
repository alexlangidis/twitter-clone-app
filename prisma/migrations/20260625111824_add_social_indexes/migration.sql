-- DropIndex
DROP INDEX "follows_followingId_idx";

-- CreateIndex
CREATE INDEX "follows_followingId_followerId_idx" ON "follows"("followingId", "followerId");

-- CreateIndex
CREATE INDEX "likes_tweetId_idx" ON "likes"("tweetId");

-- CreateIndex
CREATE INDEX "notifications_recipientId_createdAt_idx" ON "notifications"("recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_recipientId_read_idx" ON "notifications"("recipientId", "read");

-- CreateIndex
CREATE INDEX "notifications_actorId_idx" ON "notifications"("actorId");

-- CreateIndex
CREATE INDEX "notifications_tweetId_idx" ON "notifications"("tweetId");

-- CreateIndex
CREATE INDEX "notifications_type_recipientId_actorId_tweetId_createdAt_idx" ON "notifications"("type", "recipientId", "actorId", "tweetId", "createdAt");

-- CreateIndex
CREATE INDEX "retweets_tweetId_idx" ON "retweets"("tweetId");

-- CreateIndex
CREATE INDEX "tweets_createdAt_idx" ON "tweets"("createdAt");

-- CreateIndex
CREATE INDEX "tweets_authorId_parentId_createdAt_idx" ON "tweets"("authorId", "parentId", "createdAt");

-- CreateIndex
CREATE INDEX "tweets_parentId_createdAt_idx" ON "tweets"("parentId", "createdAt");
