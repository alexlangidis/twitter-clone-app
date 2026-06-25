"use client";

import { Bell } from "lucide-react";
import { useEffect } from "react";
import { useNotifications } from "./NotificationContext";
import { getUnreadNotificationCount } from "@/lib/actions/notification";

export function NotificationBadge() {
  const { unreadCount, updateUnreadCount } = useNotifications();

  useEffect(() => {
    async function fetchUnreadCount() {
      try {
        const result = await getUnreadNotificationCount();
        if (result.success) {
          updateUnreadCount(result.count || 0);
        }
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    }

    fetchUnreadCount();
  }, [updateUnreadCount]);
  return (
    <div className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );
}
