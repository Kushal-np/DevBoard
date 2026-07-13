import { useTheme } from "../../theme/useTheme";

const ThemeController = () => {
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === "dark";

    return (
        <div
            className="
                flex items-center justify-between
                w-full
                px-4 py-3
                rounded-xl
                border border-border
                bg-background
                text-text
                transition-all duration-300
            "
        >

            {/* Text */}
            <div>
                <p className="text-sm font-semibold">
                    Theme
                </p>

                <p className="text-xs opacity-60">
                    {isDark ? "Dark mode" : "Light mode"}
                </p>
            </div>


            {/* Toggle */}
            <button
                onClick={toggleTheme}
                className="
                    relative
                    w-12 h-6
                    rounded-full
                    bg-[var(--text)]/20
                    transition-all duration-300
                    p-1
                "
            >

                <span
                    className={`
                        block
                        w-4 h-4
                        rounded-full
                        bg-[var(--text)]
                        transition-transform duration-300
                        ${
                            isDark
                            ? "translate-x-6"
                            : "translate-x-0"
                        }
                    `}
                />

            </button>

        </div>
    );
};

export default ThemeController;