import { useState, useRef, useEffect } from "react";
import { Bell, Heart, UserPlus, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import type { INotification } from "../../types/Notification";

const timeAgo = (date: string): string => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
};

const iconFor = (type: INotification["type"]) => {
  switch (type) {
    case "follow":
      return UserPlus;
    case "like":
      return Heart;
    case "comment":
      return MessageCircle;
    default:
      return Bell;
  }
};

const notificationHref = (n: INotification) => {
  if (n.type === "follow") return `/profile/${n.senderId?.username}`;
  if (n.type === "message") return `/chat/${n.conversationId}`;
  if (n.postId) return `/post/${n.postId}`;
  return "#";
};

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-full p-2 text-text-secondary transition hover:bg-surface hover:text-text"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Everything below, including "See all notifications", only renders
          while the dropdown is open — previously the footer link leaked
          outside this block and stayed visible even when closed. */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 max-h-[28rem] w-80 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="font-semibold text-text">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={() => markAllAsRead()} className="text-xs text-primary hover:underline">
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-6 text-center text-sm text-text-secondary">No notifications yet.</p>
            ) : (
              notifications.slice(0, 8).map((n) => {
                const Icon = iconFor(n.type);

                return (
                  <Link
                    key={n._id}
                    to={notificationHref(n)}
                    onClick={() => {
                      if (!n.read) markAsRead(n._id);
                      setOpen(false);
                    }}
                    className={`flex items-start gap-3 px-4 py-3 transition hover:bg-background ${
                      !n.read ? "bg-primary/5" : ""
                    }`}
                  >
                    {n.senderId?.profile_url ? (
                      <img src={n.senderId.profile_url} className="h-9 w-9 shrink-0 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
                        {n.senderId?.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-text">
                        <span className="font-medium">{n.senderId?.name}</span> {n.text}
                      </p>
                      <p className="mt-0.5 text-xs text-text-secondary">{timeAgo(n.createdAt)}</p>
                    </div>

                    <Icon size={14} className="mt-1 shrink-0 text-text-secondary" />

                    {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </Link>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="block border-t border-border px-4 py-3 text-center text-sm text-primary hover:underline"
            >
              See all notifications
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;