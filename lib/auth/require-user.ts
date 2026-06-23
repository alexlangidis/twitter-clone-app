import { redirect } from "next/navigation";
import { getSession } from "./auth-actions";

export async function requireUser() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return session.user;
}
