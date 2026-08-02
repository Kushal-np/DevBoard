import { createContext, useLayoutEffect, useState, type ReactNode } from "react";

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

  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");

  localStorage.setItem("theme", theme);
}, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}