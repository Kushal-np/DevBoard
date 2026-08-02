import { useTheme } from "../../theme/useTheme";

const ThemeController = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-text transition-all duration-300">
      <div>
        <p className="text-sm font-semibold">Theme</p>
        <p className="text-xs opacity-60">{isDark ? "Dark mode" : "Light mode"}</p>
      </div>

      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="relative h-6 w-12 rounded-full bg-[var(--text)]/20 p-1 transition-all duration-300"
      >
        <span
          className={`block h-4 w-4 rounded-full bg-[var(--text)] transition-transform duration-300 ${
            isDark ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

export default ThemeController;
