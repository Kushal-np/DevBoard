// src/components/layout/Navbar.tsx

import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../theme/useTheme";
import { useAuth } from "../../hooks/useAuth";
import NotificationBell from "../Notification/NotificationBell";
import Button from "../ui/Button";

interface NavItem {
  name: string;
  path: string;
}

const navLinks: NavItem[] = [
  { name: "Home", path: "/" },
  { name: "Explore", path: "/explore" },
  { name: "Projects", path: "/projects" },
  { name: "Community", path: "/community" },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Elevation fades in on scroll rather than snapping — a 1px hairline
  // border plus a very soft shadow, never a hard drop shadow.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md transition-shadow duration
        ${scrolled ? "border-b border-border shadow-sm" : "border-b border-transparent"}`}
    >
      <div className="mx-auto flex h-16 max-w-container items-center justify-between px-4 md:px-6">
        {/* Wordmark — display serif at small size reads as a considered
            choice rather than a generic sans logotype. */}
        <Link to="/" className="flex items-center gap-2 text-text transition-colors hover:text-primary">
          <span className="font-display text-xl tracking-tight">DevBoard</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm text-text-secondary transition-colors duration-micro hover:text-text"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {isAuthenticated && <NotificationBell />}

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded border border-border
              text-text-secondary transition-colors duration-micro hover:border-border-strong hover:text-text"
          >
            {theme === "light" ? <Moon size={17} strokeWidth={1.75} /> : <Sun size={17} strokeWidth={1.75} />}
          </button>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="rounded border border-border px-4 py-2 text-sm text-text transition-colors duration-micro hover:bg-surface"
                >
                  Dashboard
                </Link>
                <Link
                  to={`/profile/${user?.username}`}
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full
                    border border-border font-mono text-sm font-medium text-text transition-transform duration-micro hover:scale-105"
                >
                  {user?.profile_url ? (
                    <img src={user.profile_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    user?.name?.[0]?.toUpperCase() ?? "?"
                  )}
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-text-secondary hover:text-text">
                  Login
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded border border-border text-text md:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu — height-animated, not display:none toggled, so the
          reveal reads as a transition rather than a jump. */}
      <div
        className={`grid overflow-hidden border-t border-border bg-background transition-[grid-template-rows] duration ease-[var(--ease)] md:hidden
          ${mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-t-0"}`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-text-secondary hover:text-text"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 border-t border-border pt-4">
              {isAuthenticated ? (
                <Link
                  to={`/profile/${user?.username}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-text"
                >
                  Profile
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-text">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="w-full">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;