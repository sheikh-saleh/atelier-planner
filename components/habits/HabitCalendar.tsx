"use client";

import { format, isSameDay, isSameMonth, startOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import type { Habit } from "@/lib/types";
import { isHabitCompletedOn, isHabitScheduledOn } from "@/lib/habitUtils";
import { cn } from "@/lib/utils";

interface HabitCalendarProps {
  habits: Habit[];
  month: Date;
}

export function HabitCalendar({ habits, month }: HabitCalendarProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = (() => {
    const d = new Date(monthStart);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return d;
  })();
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  const intensity = (date: Date): number => {
    if (habits.length === 0) return 0;
    const iso = format(date, "yyyy-MM-dd");
    const scheduled = habits.filter((h) => isHabitScheduledOn(h, iso));
    if (scheduled.length === 0) return -1; // not scheduled
    const done = scheduled.filter((h) => isHabitCompletedOn(h, iso)).length;
    return done / scheduled.length;
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {dayLabels.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const inMonth = isSameMonth(d, month);
          const today = isSameDay(d, new Date());
          const val = intensity(d);
          const iso = format(d, "yyyy-MM-dd");
          const scheduledCount = habits.filter((h) => isHabitScheduledOn(h, iso)).length;
          const doneCount = habits.filter((h) => isHabitCompletedOn(h, iso)).length;

          let bg = "var(--border-soft)";
          if (val === -1) bg = "transparent";
          else if (val === 0) bg = "var(--bg-soft)";
          else if (val < 0.34) bg = "var(--sage-100)";
          else if (val < 0.67) bg = "var(--sage-200)";
          else if (val < 1) bg = "var(--sage-300)";
          else bg = "var(--sage-500)";

          return (
            <div
              key={d.toISOString()}
              className={cn(
                "relative aspect-square rounded-md border text-[10px] font-medium flex flex-col items-center justify-center transition-colors",
                !inMonth && "opacity-30",
                today && "ring-1 ring-[var(--accent)]",
              )}
              style={{
                backgroundColor: val === -1 ? "transparent" : bg,
                borderColor: today ? "var(--accent)" : "var(--border-soft)",
                color: val >= 1 ? "var(--cream-50)" : "var(--fg)",
              }}
              title={scheduledCount > 0 ? `${doneCount}/${scheduledCount} done` : "No habits scheduled"}
            >
              <span className="tnum">{format(d, "d")}</span>
              {scheduledCount > 0 && val !== -1 && val < 1 && (
                <span className="text-[8px] opacity-70 mt-0.5">{doneCount}/{scheduledCount}</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-[var(--fg-muted)]">
        <span>Less</span>
        <div className="flex gap-0.5">
          <div className="h-2.5 w-3 rounded-sm" style={{ background: "var(--bg-soft)" }} />
          <div className="h-2.5 w-3 rounded-sm" style={{ background: "var(--sage-100)" }} />
          <div className="h-2.5 w-3 rounded-sm" style={{ background: "var(--sage-200)" }} />
          <div className="h-2.5 w-3 rounded-sm" style={{ background: "var(--sage-300)" }} />
          <div className="h-2.5 w-3 rounded-sm" style={{ background: "var(--sage-500)" }} />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
