// src/components/layout/SideBar.tsx

import { type LucideIcon, Home, Bookmark, Heart, MessageCircle, Bell, Settings, User, LogOut, Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotification";

interface NavLinkItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

const links: NavLinkItem[] = [
  { name: "Feed", path: "/feed", icon: Home },
  { name: "Search", path: "/search", icon: Search },
  { name: "Bookmarks", path: "/bookmarks", icon: Bookmark },
  { name: "Likes", path: "/likes", icon: Heart },
  { name: "Chat", path: "/chat", icon: MessageCircle },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Settings", path: "/settings", icon: Settings },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();

  return (
    <>
      {/* ---------- DESKTOP RAIL ---------- */}
      <div className="hidden h-screen w-full flex-col px-3 py-6 md:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <span className="font-display text-lg tracking-tight text-text">DevBoard</span>
        </div>

        <div className="flex flex-col gap-0.5">
          {links.map((item) => {
            const Icon = item.icon;
            const isNotifications = item.name === "Notifications";

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors duration-micro ${
                    isActive
                      ? "bg-primary-wash text-primary"
                      : "text-text-secondary hover:bg-surface hover:text-text"
                  }`
                }
              >
                <span className="relative flex shrink-0">
                  <Icon size={19} strokeWidth={1.75} />
                  {isNotifications && unreadCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 font-mono text-[9px] font-medium text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </span>
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="flex-1" />

        <NavLink
          to={`/profile/${user?.username}`}
          className="flex items-center gap-3 rounded border border-border bg-surface p-2.5 transition-colors duration-micro hover:border-border-strong"
        >
          {user?.profile_url ? (
            <img src={user.profile_url} className="h-9 w-9 shrink-0 rounded-full object-cover" alt="" />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-wash text-primary">
              <User size={16} />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text">{user?.name}</p>
            <p className="truncate font-mono text-xs text-text-tertiary">@{user?.username}</p>
          </div>
        </NavLink>

        <button
          onClick={logout}
          className="mt-2 flex items-center justify-center gap-2 rounded py-2.5 text-sm font-medium text-text-secondary transition-colors duration-micro hover:bg-danger/10 hover:text-danger"
        >
          <LogOut size={16} strokeWidth={1.75} />
          Logout
        </button>
      </div>

      {/* ---------- MOBILE BOTTOM TAB BAR ---------- */}
      <div className="safe-area-bottom fixed bottom-0 left-0 right-0 z-50 flex justify-between border-t border-border bg-background/95 px-1 py-1.5 backdrop-blur-md md:hidden">
        {links
          .filter((l) => l.name !== "Search")
          .map((item) => {
            const Icon = item.icon;
            const isNotifications = item.name === "Notifications";

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded py-2 transition-colors duration-micro ${
                    isActive ? "text-primary" : "text-text-tertiary"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative">
                      <Icon size={21} strokeWidth={1.75} />
                      {isNotifications && unreadCount > 0 && (
                        <span className="absolute -right-1.5 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-danger px-1 font-mono text-[8px] font-medium text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </span>
                    {isActive && <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-primary" />}
                  </>
                )}
              </NavLink>
            );
          })}

        <NavLink
          to={`/profile/${user?.username}`}
          className={({ isActive }) =>
            `relative flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 py-2 ${
              isActive ? "text-primary" : "text-text-tertiary"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {user?.profile_url ? (
                <img src={user.profile_url} className="h-6 w-6 rounded-full object-cover ring-1 ring-border" alt="" />
              ) : (
                <User size={21} strokeWidth={1.75} />
              )}
              {isActive && <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-primary" />}
            </>
          )}
        </NavLink>
      </div>
    </>
  );
};

export default Sidebar;