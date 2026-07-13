import {type LucideIcon, Home, Bookmark, Heart, MessageCircle, Settings, User, LogOut } from "lucide-react";
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
      {/* ---------- DESKTOP SIDEBAR (unchanged, md and up only) ---------- */}
      <div
        className="
        hidden
        md:flex
        h-screen
        w-[260px]
        border-r
        border-border
        bg-surface
        flex-col
        px-4
        py-6
        "
      >
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img
            src={logo}
            alt="DevBoard"
            className="h-14 w-14 rounded-2xl object-contain"
          />
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }: { isActive: boolean }) =>
                  `
                  flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-primary text-background"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text"
                  }
                  `
                }
              >
                <Icon size={21} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Profile */}
        <NavLink
          to="/profile"
          className="flex items-center gap-3 rounded-xl bg-background border border-border p-3"
        >
          {user?.profile_url ? (
            <img
              src={user.profile_url}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-background">
              <User size={20} />
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-text">{user?.name}</p>
            <p className="text-xs text-text-secondary">@{user?.username}</p>
          </div>
        </NavLink>

        <button
          onClick={logout}
          className="mt-3 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-danger hover:bg-red-500/10"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>

      {/* ---------- MOBILE BOTTOM NAV (below md only) ---------- */}
      <div
        className="
        flex
        md:hidden
        fixed
        bottom-0
        left-0
        right-0
        z-50
        border-t
        border-border
        bg-surface/95
        backdrop-blur-md
        px-2
        py-2
        justify-between
        "
      >
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }: { isActive: boolean }) =>
                `
                flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-medium transition
                ${
                  isActive
                    ? "text-primary"
                    : "text-text-secondary hover:text-text"
                }
                `
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        <NavLink
          to="/profile"
          className={({ isActive }: { isActive: boolean }) =>
            `
            flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-medium transition
            ${
              isActive ? "text-primary" : "text-text-secondary hover:text-text"
            }
            `
          }
        >
          {user?.profile_url ? (
            <img
              src={user.profile_url}
              className="h-5 w-5 rounded-full object-cover"
            />
          ) : (
            <User size={20} />
          )}
          <span>Profile</span>
        </NavLink>
      </div>
    </>
  );
};

export default Sidebar;