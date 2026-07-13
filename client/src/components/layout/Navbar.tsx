import { useState } from "react";
import { Moon, Sun, Code2, LayoutDashboard, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../theme/useTheme";
import { useAuth } from "../../hooks/useAuth";

interface NavItem {
  name: string;
  path: string;
}

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const navLinks: NavItem[] = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Projects", path: "/projects" },
    { name: "Community", path: "/community" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-text transition hover:text-primary"
        >
          <Code2 className="h-7 w-7" />
          <span className="text-xl font-bold tracking-tight">DevBoard</span>
        </Link>

        {/* Desktop Navigation (unchanged) */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-text-secondary transition hover:text-text"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl border border-border bg-background text-text
              transition hover:bg-surface-hover
            "
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Desktop-only auth buttons (unchanged) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="
                    flex items-center gap-2 rounded-xl border border-border
                    bg-background px-4 py-2 text-text transition hover:bg-surface-hover
                  "
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <Link
                  to="/profile"
                  className="
                    flex h-11 w-11 items-center justify-center overflow-hidden
                    rounded-full border border-border bg-primary text-background
                    font-semibold transition hover:scale-105
                  "
                >
                  <img src={user?.profile_url} alt="" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="
                    rounded-xl border border-border bg-background px-4 py-2
                    text-text transition hover:bg-surface-hover
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="
                    rounded-xl bg-primary px-4 py-2 font-medium text-background
                    transition hover:bg-primary-hover
                  "
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl border border-border bg-background text-text
              transition hover:bg-surface-hover md:hidden
            "
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="text-text-secondary transition hover:text-text"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-2 border-t border-border flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-text"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-text"
                >
                  <img
                    src={user?.profile_url}
                    alt=""
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-border bg-background px-4 py-2 text-center text-text"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-primary px-4 py-2 text-center font-medium text-background"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;