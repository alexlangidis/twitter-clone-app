import { requireUser } from "@/lib/auth/require-user";
import type { ReactNode } from "react";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUser();

  return children;
}
