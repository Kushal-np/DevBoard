import {
  Moon,
  Sun,
  Code2,
  LayoutDashboard,
  CircleUserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../theme/useTheme";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated , user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-text transition hover:text-primary"
        >
          <Code2 className="h-7 w-7" />

          <span className="text-xl font-bold tracking-tight">
            DevBoard
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-text-secondary transition hover:text-text"
          >
            Home
          </Link>

          <Link
            to="/explore"
            className="text-text-secondary transition hover:text-text"
          >
            Explore
          </Link>

          <Link
            to="/projects"
            className="text-text-secondary transition hover:text-text"
          >
            Projects
          </Link>

          <Link
            to="/community"
            className="text-text-secondary transition hover:text-text"
          >
            Community
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl
              border border-border
              bg-background
              text-text
              transition
              hover:bg-surface-hover
            "
          >
            {theme === "light" ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </button>

          {isAuthenticated ? (
            <>
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className="
                  flex items-center gap-2
                  rounded-xl
                  border border-border
                  bg-background
                  px-4 py-2
                  text-text
                  transition
                  hover:bg-surface-hover
                "
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className="
                  flex h-11 w-11 items-center justify-center
                  overflow-hidden
                  rounded-full
                  border border-border
                  bg-primary
                  text-background
                  font-semibold
                  transition
                  hover:scale-105
                "
              >
                <img src={user.profile_url} alt="" />
              </Link>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="
                  rounded-xl
                  border border-border
                  bg-background
                  px-4 py-2
                  text-text
                  transition
                  hover:bg-surface-hover
                "
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="
                  rounded-xl
                  bg-primary
                  px-4 py-2
                  font-medium
                  text-background
                  transition
                  hover:bg-primary-hover
                "
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;