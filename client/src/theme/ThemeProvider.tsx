// ThemeProvider.tsx - Fixed
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
  const [themeName, setThemeName] = useState<ThemeName>("dark"); // Changed to dark by default

  useEffect(() => {
    const saved = localStorage.getItem("theme") as ThemeName | null;
    if (saved) {
      setThemeName(saved);
    } else {
      // Set dark as default if no saved preference
      setThemeName("dark");
    }
  }, []);

  useEffect(() => {
    const theme = themeName === "light" ? lightTheme : darkTheme;
    const root = document.documentElement;

    // Apply colors to CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply theme class to root
    root.setAttribute("data-theme", themeName);
    root.classList.remove("light", "dark");
    root.classList.add(themeName);
    
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