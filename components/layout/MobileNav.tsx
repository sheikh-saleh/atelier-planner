"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, Home, LineChart, PenLine, Settings as SettingsIcon, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";

const items = [
  { href: "/", label: "Today", icon: Home },
  { href: "/habits", label: "Habits", icon: CheckSquare },
  { href: "/timer", label: "Focus", icon: Timer },
  { href: "/journal", label: "Journal", icon: PenLine },
  { href: "/stats", label: "Stats", icon: LineChart },
  { href: "/settings", label: "More", icon: SettingsIcon },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t bg-[var(--bg-card)]/95 backdrop-blur"
      style={{ borderColor: "var(--border-soft)" }}
    >
      <ul className="flex items-stretch justify-around px-1 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          const showDot = item.href === "/settings" && !user;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-1.5 rounded-md text-[10px] font-medium uppercase tracking-wider transition-colors",
                  active ? "text-[var(--accent)]" : "text-[var(--fg-soft)]",
                )}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" strokeWidth={active ? 2 : 1.5} />
                  {showDot && (
                    <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  )}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
