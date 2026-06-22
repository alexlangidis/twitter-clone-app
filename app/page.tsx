import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/auth-actions";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <Button onClick={signOut}>Logout</Button>
      </div>
    </MainLayout>
  );
}
