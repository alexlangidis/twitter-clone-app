import MainLayout from "@/components/MainLayout";
import ProfileContent from "@/components/profile/ProfileContent";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { getUserProfile } from "@/lib/actions/profile";
import { requireUser } from "@/lib/auth/require-user";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await requireUser();
  const resolvedParams = await params;
  const username = decodeURIComponent(resolvedParams.username);

  const [profileResult] = await Promise.all([getUserProfile(username)]);
  if (!profileResult.success || !profileResult.user) {
    return (
      <MainLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500">User not found</h1>
          <p className="text-muted-foreground mt-2">
            The user you&apos;re looking for doesn&apos;t exists.
          </p>
        </div>
      </MainLayout>
    );
  }

  const user = {
    ...profileResult.user,
    username: profileResult.user.username ?? username,
  };

  return (
    <MainLayout>
      <ProfileHeader user={user} currentUser={session} />
      <ProfileContent />
    </MainLayout>
  );
}
