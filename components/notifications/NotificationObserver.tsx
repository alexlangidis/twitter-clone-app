"use client";

import { useEffect } from "react";

import toast from "react-hot-toast";
import { useNotifications } from "./NotificationContext";
import { markAllNotificationsAsRead } from "@/lib/actions/notification";

export default function NotificationObserver() {
  const { markAllAsRead } = useNotifications();
  useEffect(() => {
    async function markAsRead() {
      try {
        await markAllNotificationsAsRead();
        markAllAsRead();
      } catch {
        toast.error("Failed to mark notifications as read");
      }
    }

    markAsRead();
  }, [markAllAsRead]);
  return <></>;
}
