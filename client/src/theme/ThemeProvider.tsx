import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import  { lightTheme } from "./lightTheme";
import { darkTheme } from "./darkTheme";


type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("light");

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }
  useEffect(()=>{
    const root = document.documentElement;

    const currentTheme = theme === "light" ? lightTheme : darkTheme ; 
    Object.entries(currentTheme).forEach(([key,value]) =>{
      root.style.setProperty(`--${key}`, value)
    });
  },[theme]);

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

