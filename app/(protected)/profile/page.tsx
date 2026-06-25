import MainLayout from "@/components/MainLayout";
import ProfileSetupForm from "@/components/profile/ProfileSetupForm";
import { requireUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfileIndexPage() {
  const session = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      name: true,
      username: true,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  if (user.username) {
    redirect(`/profile/${user.username}`);
  }

  return (
    <MainLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-2">Finish your profile</h1>
        <p className="text-muted-foreground mb-6">
          Google accounts can sign in without a username. Pick one to continue.
        </p>
        <ProfileSetupForm name={user.name} username="" />
      </div>
    </MainLayout>
  );
}
