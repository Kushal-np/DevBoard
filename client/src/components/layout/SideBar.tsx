import { type LucideIcon, Home, Bookmark, Heart, MessageCircle, Settings, User, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../theme/useTheme";

import blackLogo from "../../assets/black.png";
import whiteLogo from "../../assets/white.png";

interface NavLinkItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const logo = theme === "dark" ? blackLogo : whiteLogo;

  const links: NavLinkItem[] = [
    { name: "Feed", path: "/feed", icon: Home },
    { name: "Bookmarks", path: "/bookmarks", icon: Bookmark },
    { name: "Likes", path: "/likes", icon: Heart },
    { name: "Chat", path: "/chat", icon: MessageCircle },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* ---------- DESKTOP RAIL ---------- */}
      <div className="hidden h-screen w-full flex-col px-3 py-6 md:flex">
        <div className="mb-8 flex justify-center">
          <img src={logo} alt="DevBoard" className="h-9 w-9 rounded-xl object-contain" />
        </div>

        <div className="flex flex-col gap-1">
          {links.map((item) => {
            const Icon = item.icon;
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
                <Icon size={19} strokeWidth={1.75} />
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
            <img
              src={user.profile_url}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
              alt=""
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <User size={17} />
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-text">{user?.name}</p>
            <p className="truncate font-mono text-[11px] text-text-secondary">
              @{user?.username}
            </p>
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
        {links.map((item) => {
          const Icon = item.icon;
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
                  <Icon size={21} strokeWidth={1.75} />
                  {isActive && (
                    <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-primary" />
                  )}
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
              {isActive && (
                <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-primary" />
              )}
            </>
          )}
        </NavLink>
      </div>
    </>
  );
};

export default Sidebar;