"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useHydrated } from "@/hooks/useHydrated";

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  showDate?: boolean;
}

export function Header({ title, subtitle, action, showDate = true }: HeaderProps) {
  const hydrated = useHydrated();
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-8">
      <div>
        {showDate && (
          <div
            className="font-serif text-[11px] uppercase tracking-[0.3em] text-[var(--accent)] mb-1.5"
            suppressHydrationWarning
          >
            {hydrated ? format(new Date(), "EEEE · MMMM d, yyyy") : "\u00A0"}
          </div>
        )}
        <h1 className="font-serif text-3xl sm:text-4xl italic tracking-tight" style={{ color: "var(--fg)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm text-[var(--fg-soft)] max-w-prose">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2 self-start sm:self-end">
        {action}
        <ThemeToggle />
      </div>
    </header>
  );
}

export function Brand({ small = false }: { small?: boolean }) {
  return (
    <Link href="/app" className="lg:hidden block">
      <div className={small ? "font-display text-xl italic" : "font-display text-2xl italic"} style={{ color: "var(--fg)" }}>
        Atelier
      </div>
    </Link>
  );
}
