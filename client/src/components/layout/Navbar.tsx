// src/components/layout/Navbar.tsx

import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X,  User, LogOut, Settings, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../theme/useTheme";
import { useAuth } from "../../hooks/useAuth";
import NotificationBell from "../Notification/NotificationBell";
import Button from "../ui/Button";
import blackLogo from "../../assets/black.png";
import whiteLogo from "../../assets/white.png";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showProfileMenu && !(e.target as Element).closest(".profile-menu")) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showProfileMenu]);

  return (
    <nav
      className={`sticky top-0 z-50 bg-background/80 backdrop-blur-xl transition-all duration-300
        ${scrolled ? "border-b border-border shadow-[0_1px_3px_rgba(0,0,0,0.05)]" : "border-b border-transparent"}`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <img
            src={theme === "light" ? whiteLogo : blackLogo}
            alt="DevBoard"
            className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-display text-xl font-semibold tracking-tight text-text transition-colors duration-300 group-hover:text-primary">
            Dev<span className="text-primary group-hover:text-text">Board</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {/* Navigation links - removed Explore */}
          <div className="flex items-center gap-1">
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
                  ${location.pathname === "/dashboard" 
                    ? "bg-primary/10 text-primary" 
                    : "text-text-secondary hover:bg-surface hover:text-text"}`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border
                text-text-secondary transition-all duration-200 hover:border-border-strong hover:bg-surface hover:text-text"
            >
              {theme === "light" ? <Moon size={16} strokeWidth={1.5} /> : <Sun size={16} strokeWidth={1.5} />}
            </button>

            {isAuthenticated && <NotificationBell />}

            {isAuthenticated ? (
              <div className="relative profile-menu">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 transition-all duration-200 hover:border-border-strong hover:bg-surface"
                >
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-mono text-sm font-medium text-primary">
                    {user?.profile_url ? (
                      <img src={user.profile_url} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      user?.name?.[0]?.toUpperCase() ?? "?"
                    )}
                  </div>
                  <span className="max-w-[100px] truncate text-sm text-text">
                    {user?.name || user?.username}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`}>
                    <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Profile dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-background p-1 shadow-xl animate-fade-in-up">
                    <Link
                      to={`/profile/${user?.username}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text transition-colors hover:bg-surface"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User size={16} className="text-text-secondary" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text transition-colors hover:bg-surface"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings size={16} className="text-text-secondary" />
                      <span>Settings</span>
                    </Link>
                    <div className="my-1 h-px bg-border" />
                    <button
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/10"
                      onClick={() => {
                        // handle logout
                        setShowProfileMenu(false);
                      }}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="tertiary" size="sm" className="font-medium">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="font-medium">
                    Get started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:bg-surface"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text transition-colors hover:bg-surface"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`grid overflow-hidden border-t border-border bg-background transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden
          ${mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-t-0"}`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                    ${location.pathname === "/dashboard" ? "bg-primary/10 text-primary" : "text-text hover:bg-surface"}`}
                >
                  <Home size={16} className="text-text-secondary" />
                  Dashboard
                </Link>
                <Link
                  to={`/profile/${user?.username}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text hover:bg-surface"
                >
                  <User size={16} className="text-text-secondary" />
                  Profile
                </Link>
                <div className="my-1 h-px bg-border" />
                <button
                  onClick={() => {
                    // handle logout
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-danger hover:bg-danger/10"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="tertiary" size="md" className="w-full font-medium">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button size="md" className="w-full font-medium">
                    Get started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;