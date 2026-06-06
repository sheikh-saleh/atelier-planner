"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur"
      style={{
        borderColor: "var(--border-soft)",
        background: "color-mix(in srgb, var(--bg) 85%, transparent)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-2.5 shrink-0">
          <span className="font-display text-2xl italic" style={{ color: "var(--fg)" }}>
            Atelier
          </span>
          <span className="hidden sm:inline font-serif text-[10px] uppercase tracking-[0.3em] text-[var(--fg-soft)]">
            Daily Routine
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const isActive = l.href === "/#features"
              ? pathname === "/" && false
              : pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="font-serif text-sm transition-colors hover:text-[var(--accent)]"
                style={{ color: isActive ? "var(--accent)" : "var(--fg-soft)" }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/auth"
            className="font-serif text-sm transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--fg-soft)" }}
          >
            Sign in
          </Link>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium tracking-wide bg-ink-500 text-cream-50 hover:bg-ink-400 dark:bg-cream-100 dark:text-ink-500 dark:hover:bg-cream-200 transition-colors"
          >
            Get started
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 -mr-2"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t" style={{ borderColor: "var(--border-soft)" }}>
          <div className="px-6 py-5 space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn("block font-serif text-base py-2 transition-colors")}
                style={{ color: "var(--fg)" }}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-4 mt-3 border-t flex items-center justify-between gap-3" style={{ borderColor: "var(--border-soft)" }}>
              <ThemeToggle />
              <div className="flex items-center gap-2">
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  className="font-serif text-sm px-3 py-2"
                  style={{ color: "var(--fg-soft)" }}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium tracking-wide bg-ink-500 text-cream-50 hover:bg-ink-400 dark:bg-cream-100 dark:text-ink-500 dark:hover:bg-cream-200 transition-colors"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
