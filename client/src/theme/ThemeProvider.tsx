import { createContext, useLayoutEffect, useState, type ReactNode } from "react";
import { lightTheme } from "./lightTheme";
import { darkTheme } from "./darkTheme";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  // useLayoutEffect runs synchronously before the browser paints, so the
  // class + variables are applied before the user sees anything — this is
  // what prevents a flash of the old theme when toggling.
  useLayoutEffect(() => {
    const root = document.documentElement;

    // Keep the class in sync — index.css reads `.light` to swap variables,
    // this is what your Tailwind `@theme` tokens ultimately resolve through.
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");

    // Also apply the theme object's values directly as inline custom
    // properties. This is redundant with the CSS-only `.light` rule in
    // index.css, but kept here (as requested, nothing removed) in case
    // lightTheme/darkTheme diverge from index.css or are used as the
    // source of truth elsewhere.
    const currentTheme = theme === "light" ? lightTheme : darkTheme;
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      const cssVariable = "--" + key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
      root.style.setProperty(cssVariable, value as string);
    });

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}