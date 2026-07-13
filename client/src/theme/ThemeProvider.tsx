import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { lightTheme } from "./lightTheme";
import { darkTheme } from "./darkTheme";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {

  // Read from localStorage when the app starts
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return "light";
  });

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  // Save whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Apply CSS variables
  useEffect(() => {
    const root = document.documentElement;

    const currentTheme =
      theme === "light" ? lightTheme : darkTheme;

    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      const cssVariable =
        "--" + key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

      root.style.setProperty(cssVariable, value);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}