"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useData } from "./DataProvider";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data, hydrated, setSettings } = useData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme: Theme = data.settings.theme;

  // Sync the dark class to <html> whenever the theme changes
  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme, hydrated]);

  const toggleTheme = useCallback(() => {
    setSettings({ theme: theme === "dark" ? "light" : "dark" });
  }, [theme, setSettings]);

  const setTheme = useCallback((t: Theme) => setSettings({ theme: t }), [setSettings]);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme, mounted }),
    [theme, toggleTheme, setTheme, mounted],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
