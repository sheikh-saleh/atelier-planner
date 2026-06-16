"use client";

import { useMemo } from "react";
import { addDays, format, startOfDay } from "date-fns";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useData } from "@/components/providers/DataProvider";
import { isHabitCompletedOn, isHabitScheduledOn } from "@/lib/habitUtils";

export function HabitHeatmap() {
  const { data } = useData();
  const grid = useMemo(() => {
    const today = startOfDay(new Date());
    const days = Array.from({ length: 49 }).map((_, i) => addDays(today, -(48 - i)));
    return days.map((d) => {
      const iso = format(d, "yyyy-MM-dd");
      const scheduled = data.habits.filter((h) => isHabitScheduledOn(h, iso));
      const done = scheduled.filter((h) => isHabitCompletedOn(h, iso)).length;
      const rate = scheduled.length === 0 ? -1 : done / scheduled.length;
      return { iso, d, scheduled: scheduled.length, done, rate };
    });
  }, [data.habits]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-serif text-lg italic">Habit Consistency</h3>
          <p className="text-xs text-[var(--fg-soft)] mt-0.5">Last 7 weeks</p>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {grid.map(({ d, rate }, index) => {
          let bg = "var(--border-soft)";
          if (rate === -1) bg = "transparent";
          else if (rate === 0) bg = "var(--bg-soft)";
          else if (rate < 0.34) bg = "var(--sage-100)";
          else if (rate < 0.67) bg = "var(--sage-200)";
          else if (rate < 1) bg = "var(--sage-300)";
          else bg = "var(--sage-500)";

          return (
            <motion.div
              key={d.toISOString()}
              className="aspect-square rounded"
              style={{ backgroundColor: bg }}
              title={format(d, "MMM d")}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01, duration: 0.3 }}
            />
          );
        })}
      </div>
    </Card>
  );
}
