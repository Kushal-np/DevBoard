import { type LucideIcon, Home, Bookmark, Heart, MessageCircle, Bell, Settings, User, LogOut, Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../theme/useTheme";
import { useNotification } from "../../hooks/useNotification";

interface NavLinkItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { unreadCount } = useNotification();

  const links: NavLinkItem[] = [
    { name: "Feed", path: "/feed", icon: Home },
    { name: "Search", path: "/search", icon: Search },
    { name: "Bookmarks", path: "/bookmarks", icon: Bookmark },
    { name: "Likes", path: "/likes", icon: Heart },
    { name: "Chat", path: "/chat", icon: MessageCircle },
    { name: "Notifications", path: "/notifications", icon: Bell },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* ---------- DESKTOP RAIL ---------- */}
      <div className="hidden h-screen w-full flex-col px-3 py-6 md:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl font-display text-sm font-bold ${
              theme === "dark" ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            DB
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {links.map((item) => {
            const Icon = item.icon;
            const isNotifications = item.name === "Notifications";

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text"
                  }`
                }
              >
                <span className="relative">
                  <Icon size={19} strokeWidth={1.75} />
                  {isNotifications && unreadCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">
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
          className="flex items-center gap-3 rounded-xl border border-border bg-background p-2.5 transition hover:border-text-secondary/30"
        >
          {user?.profile_url ? (
            <img src={user.profile_url} className="h-9 w-9 shrink-0 rounded-full object-cover" alt="" />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <User size={17} />
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-text">{user?.name}</p>
            <p className="truncate font-mono text-[11px] text-text-secondary">@{user?.username}</p>
          </div>
        </NavLink>

        <button
          onClick={logout}
          className="mt-2 flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-medium text-text-secondary transition hover:bg-danger/10 hover:text-danger"
        >
          <LogOut size={17} strokeWidth={1.75} />
          Logout
        </button>
      </div>

      {/* ---------- MOBILE BOTTOM TAB BAR ---------- */}
      <div className="safe-area-bottom fixed bottom-0 left-0 right-0 z-50 flex justify-between border-t border-border bg-surface/95 px-1 py-1.5 backdrop-blur-md md:hidden">
        {links
          .filter((l) => l.name !== "Search")
          .map((item) => {
            const Icon = item.icon;
            const isNotifications = item.name === "Notifications";

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }: { isActive: boolean }) =>
                  `relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-2 transition ${
                    isActive ? "text-primary" : "text-text-secondary/70"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative">
                      <Icon size={21} strokeWidth={1.75} />
                      {isNotifications && unreadCount > 0 && (
                        <span className="absolute -right-1.5 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-danger px-1 text-[8px] font-bold text-white">
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
          className={({ isActive }: { isActive: boolean }) =>
            `relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 ${
              isActive ? "text-primary" : "text-text-secondary/70"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {user?.profile_url ? (
                <img
                  src={user.profile_url}
                  className="h-6 w-6 rounded-full object-cover ring-1 ring-border"
                  alt=""
                />
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
