import { createContext, useEffect, useState } from "react";
import type { Theme } from "./theme";
import { lightTheme } from "./lightTheme";
import { darkTheme } from "./darkTheme";

type ThemeName = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  themeName: ThemeName;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as ThemeName | null;
    if (saved) setThemeName(saved);
  }, []);

  useEffect(() => {
    const theme = themeName === "light" ? lightTheme : darkTheme;
    const root = document.documentElement;

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    root.setAttribute("data-theme", themeName);
    localStorage.setItem("theme", themeName);
  }, [themeName]);

  const toggleTheme = () => {
    setThemeName((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = themeName === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};