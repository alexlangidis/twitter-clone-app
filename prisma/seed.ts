import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

const users = [
  {
    id: "seed-user-alex",
    name: "Alex Morgan",
    email: "alex@example.com",
    emailVerified: true,
    username: "alexcodes",
    bio: "Frontend developer building useful things for the web.",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex",
  },
  {
    id: "seed-user-maya",
    name: "Maya Chen",
    email: "maya@example.com",
    emailVerified: true,
    username: "mayadesigns",
    bio: "Product designer, coffee enthusiast, and occasional photographer.",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Maya",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Maya",
  },
  {
    id: "seed-user-sam",
    name: "Sam Rivera",
    email: "sam@example.com",
    emailVerified: true,
    username: "sam_builds",
    bio: "Full-stack engineer learning in public.",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sam",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sam",
  },
] as const;

const tweets = [
  {
    id: "seed-tweet-01",
    authorId: "seed-user-alex",
    content:
      "Just shipped the first version of my new project. Small steps still count as progress 🚀",
    createdAt: new Date("2026-06-22T08:15:00.000Z"),
  },
  {
    id: "seed-tweet-02",
    authorId: "seed-user-maya",
    content:
      "A good interface should make the next action feel obvious without needing an explanation.",
    createdAt: new Date("2026-06-22T09:30:00.000Z"),
  },
  {
    id: "seed-tweet-03",
    authorId: "seed-user-sam",
    content:
      "Today I finally understood why database indexes matter. The same query went from slow to instant.",
    createdAt: new Date("2026-06-22T10:10:00.000Z"),
  },
  {
    id: "seed-tweet-04",
    authorId: "seed-user-alex",
    content: "Morning walk before coding. Best debugging tool I know.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date("2026-06-22T11:05:00.000Z"),
  },
  {
    id: "seed-tweet-05",
    authorId: "seed-user-maya",
    content:
      "Design tip: reduce visual noise before adding another component. The solution is often subtraction.",
    createdAt: new Date("2026-06-22T12:20:00.000Z"),
  },
  {
    id: "seed-tweet-06",
    authorId: "seed-user-sam",
    content:
      "What is one developer tool you wish you had learned earlier? Mine is definitely the debugger.",
    createdAt: new Date("2026-06-22T13:45:00.000Z"),
  },
  {
    id: "seed-tweet-07",
    authorId: "seed-user-alex",
    content:
      "Readable code beats clever code. Your future self is another developer who needs good documentation.",
    createdAt: new Date("2026-06-22T14:30:00.000Z"),
  },
  {
    id: "seed-tweet-08",
    authorId: "seed-user-maya",
    content: "A quiet place, a notebook, and enough time to think.",
    imageUrl:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date("2026-06-22T15:10:00.000Z"),
  },
] as const;

const replies = [
  {
    id: "seed-reply-01",
    authorId: "seed-user-maya",
    parentId: "seed-tweet-01",
    content: "Congratulations! Shipping is the hardest and most important part.",
    createdAt: new Date("2026-06-22T08:25:00.000Z"),
  },
  {
    id: "seed-reply-02",
    authorId: "seed-user-sam",
    parentId: "seed-tweet-01",
    content: "Nice work! What are you planning to build next?",
    createdAt: new Date("2026-06-22T08:40:00.000Z"),
  },
  {
    id: "seed-reply-03",
    authorId: "seed-user-alex",
    parentId: "seed-tweet-06",
    content: "Git bisect. It has saved me hours when tracking regressions.",
    createdAt: new Date("2026-06-22T14:00:00.000Z"),
  },
] as const;

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }

  const tweetIds = [...tweets, ...replies].map((tweet) => tweet.id);

  await prisma.tweet.deleteMany({
    where: { id: { in: tweetIds } },
  });

  await prisma.tweet.createMany({ data: [...tweets] });
  await prisma.tweet.createMany({ data: [...replies] });

  console.log(`Seeded ${users.length} users and ${tweetIds.length} tweets.`);
}

main()
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
