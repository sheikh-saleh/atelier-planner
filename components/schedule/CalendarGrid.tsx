"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
} from "date-fns";

interface CalendarGridProps {
  year: number;
  month: number; // 0-indexed
  tasks: Task[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const categoryDots: Record<string, string> = {
  work: "bg-blue-dusty-300",
  personal: "bg-sage-300",
  health: "bg-burgundy-300",
  leisure: "bg-gold-300",
  errand: "bg-ink-300",
};

export function CalendarGrid({
  year,
  month,
  tasks,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) {
  const monthDate = new Date(year, month, 1);

  const days = useMemo(() => {
    const monthDate = new Date(year, month, 1);
    const start = startOfWeek(startOfMonth(monthDate));
    const end = endOfWeek(endOfMonth(monthDate));
    return eachDayOfInterval({ start, end });
  }, [year, month]);

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (!map[task.date]) map[task.date] = [];
      map[task.date].push(task);
    }
    return map;
  }, [tasks]);

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={onPrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-serif text-lg italic" style={{ color: "var(--fg)" }}>
          {format(monthDate, "MMMM yyyy")}
        </h2>
        <Button variant="ghost" size="sm" onClick={onNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center font-serif text-[10px] uppercase tracking-[0.2em] text-[var(--fg-muted)] py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px" style={{ background: "var(--border-soft)" }}>
        {days.map((day) => {
          const iso = format(day, "yyyy-MM-dd");
          const dayTasks = tasksByDate[iso] ?? [];
          const inMonth = isSameMonth(day, monthDate);
          const today = isToday(day);
          const selected = iso === selectedDate;

          return (
            <button
              key={iso}
              onClick={() => onSelectDate(iso)}
              className={cn(
                "relative flex flex-col items-center py-2 min-h-[4rem] transition-colors",
                inMonth ? "bg-[var(--bg-card)]" : "bg-[var(--bg-card)]/50",
                today && !selected && "ring-1 ring-[var(--accent)] ring-inset",
                selected && "bg-[var(--accent)]/10",
                "hover:bg-[var(--accent)]/5",
              )}
            >
              <span
                className={cn(
                  "text-sm font-serif",
                  !inMonth && "text-[var(--fg-muted)] opacity-40",
                  inMonth && !today && "text-[var(--fg)]",
                  today && "font-bold text-[var(--accent)]",
                )}
              >
                {format(day, "d")}
              </span>

              {/* Task dots */}
              {dayTasks.length > 0 && (
                <div className="flex items-center gap-0.5 mt-1 flex-wrap justify-center max-w-[3rem]">
                  {dayTasks.slice(0, 3).map((task) => (
                    <span
                      key={task.id}
                      className={cn("w-1.5 h-1.5 rounded-full", categoryDots[task.category])}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="text-[8px] text-[var(--fg-muted)] leading-none">
                      +{dayTasks.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
