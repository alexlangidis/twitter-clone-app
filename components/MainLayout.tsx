import React from "react";
import Sidebar from "./Sidebar";
import { NotificationProvider } from "./notifications/NotificationContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto">{children}</div>
        </main>
      </div>
    </NotificationProvider>
  );
}
