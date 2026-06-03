"use client";

import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useData } from "@/components/providers/DataProvider";
import { JournalEditor } from "./JournalEditor";
import { todayISO, formatDate } from "@/lib/dateUtils";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";

export function JournalView() {
  const { data } = useData();
  const hydrated = useHydrated();
  const [active, setActive] = useState("");

  useEffect(() => {
    if (hydrated && !active) setActive(todayISO());
  }, [hydrated, active]);

  const entries = useMemo(
    () =>
      Object.values(data.journal)
        .filter((e) => e.content.trim().length > 0)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [data.journal],
  );

  const move = (delta: number) => {
    if (!active) return;
    const d = parseISO(active);
    d.setDate(d.getDate() + delta);
    setActive(format(d, "yyyy-MM-dd"));
  };

  if (!hydrated || !active) {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 w-48 bg-cream-200 dark:bg-ink-400 rounded animate-pulse" />
          <div className="h-64 rounded-xl bg-cream-200 dark:bg-ink-400 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-serif text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">
              {formatDate(active, "EEEE · MMMM d")}
            </div>
            <h2 className="font-serif text-3xl italic mt-1">{formatDate(active, "yyyy")}</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => move(-1)}
              className="p-2 rounded hover:bg-cream-200 dark:hover:bg-ink-400"
              aria-label="Previous day"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActive(todayISO())}
              className="px-3 h-9 text-xs font-medium rounded border hover:bg-cream-200 dark:hover:bg-ink-400"
              style={{ borderColor: "var(--border-soft)" }}
            >
              Today
            </button>
            <button
              onClick={() => move(1)}
              className="p-2 rounded hover:bg-cream-200 dark:hover:bg-ink-400"
              aria-label="Next day"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <JournalEditor date={active} />
      </div>

      <div>
        <div className="font-serif text-[11px] uppercase tracking-[0.25em] text-[var(--fg-soft)] mb-3">
          Past Entries
        </div>
        {entries.length === 0 ? (
          <p className="text-sm text-[var(--fg-muted)] italic font-serif">
            No entries yet. Begin with a single sentence.
          </p>
        ) : (
          <ul className="space-y-2">
            {entries.slice(0, 30).map((e) => (
              <li key={e.date}>
                <button
                  onClick={() => setActive(e.date)}
                  className={cn(
                    "w-full text-left rounded-md border p-3 transition-colors",
                    active === e.date
                      ? "bg-[var(--accent-soft)] border-[var(--accent)]"
                      : "border-[var(--border-soft)] hover:bg-cream-100 dark:hover:bg-ink-400/50",
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif text-sm italic">
                      {formatDate(e.date, "MMM d, yyyy")}
                    </span>
                    {e.mood && <span className="text-base">{["😔","😕","😐","🙂","😊"][e.mood - 1]}</span>}
                  </div>
                  <p className="text-xs text-[var(--fg-soft)] line-clamp-2 leading-relaxed">
                    {e.content}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
