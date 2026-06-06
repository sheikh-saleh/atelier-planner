"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useData } from "@/components/providers/DataProvider";
import { isHabitCompletedOn, isHabitScheduledOn } from "@/lib/habitUtils";
import { todayISO } from "@/lib/dateUtils";
import { useHydrated } from "@/hooks/useHydrated";

export function TodayProgress() {
  const { data } = useData();
  const hydrated = useHydrated();
  const today = hydrated ? todayISO() : "";

  const stats = useMemo(() => {
    if (!hydrated) return { taskRate: 0, habitRate: 0, focusMin: 0 };
    const tasks = data.tasks.filter((t) => t.date === today);
    const tasksDone = tasks.filter((t) => t.completed).length;
    const habitsToday = data.habits.filter((h) => isHabitScheduledOn(h, today));
    const habitsDone = habitsToday.filter((h) => isHabitCompletedOn(h, today)).length;
    const focusMin = data.pomodoros
      .filter((p) => p.date === today && p.type === "focus" && p.completed)
      .reduce((acc, p) => acc + p.durationMin, 0);
    return {
      taskRate: tasks.length === 0 ? 0 : Math.round((tasksDone / tasks.length) * 100),
      habitRate: habitsToday.length === 0 ? 0 : Math.round((habitsDone / habitsToday.length) * 100),
      focusMin,
    };
  }, [data, today, hydrated]);

  return (
    <Card>
      <h3 className="font-serif text-lg italic mb-4 lg:mb-2 lg:text-base">Today at a Glance</h3>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-2">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-[84px] sm:h-[84px] lg:w-16 lg:h-16">
            <ProgressRing
              value={stats.taskRate}
              size={84}
              stroke={6}
              fillColor="var(--blue-dusty-500)"
              label={
                <div className="text-center">
                  <div className="font-display tnum text-base sm:text-xl lg:text-base">
                    {stats.taskRate}
                    <span className="text-[10px] sm:text-xs lg:text-[10px]">%</span>
                  </div>
                </div>
              }
            />
          </div>
          <div className="mt-1.5 text-[10px] uppercase tracking-wider text-[var(--fg-soft)]">Tasks</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-[84px] sm:h-[84px] lg:w-16 lg:h-16">
            <ProgressRing
              value={stats.habitRate}
              size={84}
              stroke={6}
              fillColor="var(--sage-500)"
              label={
                <div className="text-center">
                  <div className="font-display tnum text-base sm:text-xl lg:text-base">
                    {stats.habitRate}
                    <span className="text-[10px] sm:text-xs lg:text-[10px]">%</span>
                  </div>
                </div>
              }
            />
          </div>
          <div className="mt-1.5 text-[10px] uppercase tracking-wider text-[var(--fg-soft)]">Habits</div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="font-display tnum text-2xl sm:text-3xl lg:text-xl" style={{ color: "var(--fg)" }}>
            {stats.focusMin}
          </div>
          <div className="mt-1.5 text-[10px] uppercase tracking-wider text-[var(--fg-soft)]">Focus min</div>
        </div>
      </div>
    </Card>
  );
}
