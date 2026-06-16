"use client";

import { useMemo } from "react";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useData } from "@/components/providers/DataProvider";
import { computeStreak } from "@/lib/habitUtils";
import { colorMap } from "@/lib/utils";

export function StreakLeaderboard() {
  const { data } = useData();
  const ranked = useMemo(
    () =>
      [...data.habits]
        .map((h) => ({ habit: h, ...computeStreak(h) }))
        .sort((a, b) => b.current - a.current || b.best - a.best)
        .slice(0, 5),
    [data.habits],
  );

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Flame className="h-4 w-4 text-burgundy-300" />
        <h3 className="font-serif text-lg italic">Streaks</h3>
      </div>
      {ranked.length === 0 ? (
        <p className="text-sm text-[var(--fg-muted)] font-serif italic">No habits yet.</p>
      ) : (
        <ol className="space-y-2.5">
          {ranked.map(({ habit, current, best }, idx) => {
            const c = colorMap[habit.color] ?? colorMap.sage;
            return (
              <li key={habit.id} className="flex items-center gap-3">
                <div className="w-5 text-xs font-serif italic text-[var(--fg-muted)] tnum">{idx + 1}</div>
                <div className={`h-2.5 w-2.5 rounded-full ${c.bg}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{habit.title}</p>
                </div>
                <div className="text-right">
                  <motion.div
                    className="text-sm font-medium tnum"
                    key={current}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {current}
                  </motion.div>
                  {best > 0 && (
                    <div className="text-[10px] text-[var(--fg-muted)] tnum">best {best}</div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
