import { useToast } from "@/context/ToastContext";
import React, { useEffect, useState } from "react";
import type { Notification } from "@/types";
import {
  MdCheckCircle,
  MdDelete,
  MdDoneAll,
  MdGroup,
  MdInfo,
  MdTask,
  MdWarning,
} from "react-icons/md";
import { authFetch } from "@/utils/AuthFetch";
import { AppLayout } from "@/components";

const typeIcon: Record<string, React.ReactNode> = {
  task: <MdTask size={14} className="text-blue-400" />,
  team: <MdGroup size={14} className="text-teal-400" />,
  schedule: <MdWarning size={14} className="text-amber-400" />,
  system: <MdInfo size={14} className="text-neutral-400" />,
};

const Notifications = () => {
  const { showToast } = useToast();
  const [notifications, setNotification] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await authFetch(
        "http://localhost:8080/api/notification"
      );
      if (!response.ok) throw new Error("Failed to Fetch Notifications");

      const data = await response.json();
      setNotification(data);
    } catch (err) {
      showToast("Failed to Fetch Notification", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await authFetch(`http://localhost:8080/api/notification/${id}/read`, {
        method: "PATCH",
      });
      setNotification((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      showToast("Failed to Mark as Read to Notification", "error");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await authFetch("http://localhost:8080/api/notification/read-all", {
        method: "PATCH",
      });
      setNotification((prev) => prev.map((n) => ({ ...n, read: true })));
      showToast("All Notification is Mark as Read", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await authFetch(`http://localhost:8080/api/notification/${id}`, {
        method: "DELETE",
      });
      showToast("Notification Successfully Deleted", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppLayout title="Notifications">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-[12px] text-neutral-600">
          {unreadCount > 0 ? (
            <span className="text-blue-400 font-medium">
              {unreadCount} unread
            </span>
          ) : (
            "All caught up"
          )}
        </p>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 text-neutral-400 text-[12px] hover:bg-neutral-900 transition-colors"
          >
            <MdDoneAll size={14} /> Mark all as read
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="bg-[#0f0f0d] border border-neutral-900 rounded-xl overflow-hidden">
        {loading ? (
          <p className="text-[12px] text-neutral-700 p-5">Loading...</p>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <MdCheckCircle size={24} className="text-neutral-800" />
            <p className="text-[12px] text-neutral-700">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`flex items-start gap-3 px-5 py-4 border-b border-neutral-900 last:border-none transition-colors ${
                !n.read ? "bg-[#111110]" : ""
              }`}
            >
              {/* Icon */}
              <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                {typeIcon[n.type]}
              </div>

              {/* Content */}
              <div className="flex-1">
                <p
                  className={`text-[13px] ${
                    n.read ? "text-neutral-500" : "text-neutral-200"
                  }`}
                >
                  {n.message}
                </p>
                <p className="text-[11px] text-neutral-700 mt-0.5 font-mono">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {!n.read && (
                  <button
                    onClick={() => handleMarkAsRead(n._id)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Mark read
                  </button>
                )}
                <button onClick={() => handleDelete(n._id)}>
                  <MdDelete
                    size={14}
                    className="text-neutral-700 hover:text-red-400 transition-colors"
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
};

export default Notifications;
