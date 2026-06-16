"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border text-[var(--fg-soft)]",
        "hover:bg-cream-200 dark:hover:bg-ink-400 hover:text-[var(--fg)]",
        "transition-colors",
        className,
      )}
      style={{ borderColor: "var(--border-soft)" }}
      aria-label={
        mounted
          ? theme === "dark"
            ? "Switch to light"
            : "Switch to dark"
          : "Toggle theme"
      }
      suppressHydrationWarning
    >
      {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
    </button>
  );
}
