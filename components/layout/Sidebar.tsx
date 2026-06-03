"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, CheckSquare, Home, LineChart, PenLine, Settings as SettingsIcon, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Today", icon: Home },
  { href: "/habits", label: "Habits", icon: CheckSquare },
  { href: "/timer", label: "Pomodoro", icon: Timer },
  { href: "/journal", label: "Journal", icon: PenLine },
  { href: "/stats", label: "Insights", icon: LineChart },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-r" style={{ borderColor: "var(--border-soft)" }}>
      <div className="flex flex-col h-full px-5 py-8">
        <Link href="/" className="block mb-10">
          <div className="font-display text-3xl italic tracking-wide" style={{ color: "var(--fg)" }}>
            Atelier
          </div>
          <div className="font-serif text-[10px] uppercase tracking-[0.3em] text-[var(--fg-soft)] mt-1">
            Daily Routine
          </div>
        </Link>

        <nav className="flex-1 space-y-1">
          {items.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-cream-200 text-[var(--fg)] dark:bg-ink-400"
                    : "text-[var(--fg-soft)] hover:bg-cream-100 hover:text-[var(--fg)] dark:hover:bg-ink-400/50",
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-[var(--accent)]" : "")} strokeWidth={1.5} />
                <span className="font-serif tracking-wide">{item.label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t" style={{ borderColor: "var(--border-soft)" }}>
          <p className="font-serif text-[11px] italic text-[var(--fg-muted)] leading-relaxed">
            &ldquo;Discipline equals freedom.&rdquo;
          </p>
        </div>
      </div>
    </aside>
  );
}
