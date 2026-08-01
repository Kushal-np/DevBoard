import { Heart, UserPlus, MessageCircle, Bell, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotification } from "../hooks/useNotification";
import type { INotification } from "../types/Notification";

const timeAgo = (date: string): string => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
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

const iconColorFor = (type: INotification["type"]) => {
  switch (type) {
    case "follow":
      return "text-primary bg-primary/10";
    case "like":
      return "text-danger bg-danger/10";
    case "comment":
      return "text-accent bg-accent/10";
    default:
      return "text-text-secondary bg-surface";
  }
};

const notificationHref = (n: INotification) => {
  if (n.type === "follow") return `/profile/${n.senderId?.username}`;
  if (n.type === "message") return `/chat/${n.conversationId}`;
  if (n.postId) return `/post/${n.postId}`;
  return "#";
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const Notifications = () => {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } =
    useNotification();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-text">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="mt-1 text-sm text-text-secondary">
                {unreadCount} unread
              </p>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-secondary transition hover:border-primary/40 hover:text-text"
            >
              <CheckCheck size={15} />
              Mark all as read
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-surface animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface py-20 text-center">
            <Bell className="mb-3 h-8 w-8 text-text-secondary/40" />
            <p className="text-sm text-text-secondary">
              You don't have any notifications yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const Icon = iconFor(n.type);

              return (
                <Link
                  key={n._id}
                  to={notificationHref(n)}
                  onClick={() => {
                    if (!n.read) markAsRead(n._id);
                  }}
                  className={`flex items-start gap-3 rounded-2xl border p-4 transition hover:border-primary/40 ${
                    n.read
                      ? "border-border bg-surface"
                      : "border-primary/30 bg-primary/5"
                  }`}
                >
                  {n.senderId?.profile_url ? (
                    <img
                      src={n.senderId.profile_url}
                      alt={n.senderId.username}
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {getInitials(n.senderId?.name)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-text">
                      <span className="font-semibold">{n.senderId?.name}</span>{" "}
                      {n.text}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>

                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconColorFor(
                      n.type
                    )}`}
                  >
                    <Icon size={15} />
                  </div>

                  {!n.read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;