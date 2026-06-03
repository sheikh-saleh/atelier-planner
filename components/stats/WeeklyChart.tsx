"use client";

import { useMemo } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { useData } from "@/components/providers/DataProvider";

export function WeeklyChart() {
  const { data } = useData();
  const chart = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    return days.map((d) => {
      const iso = format(d, "yyyy-MM-dd");
      const total = data.tasks.filter((t) => t.date === iso).length;
      const done = data.tasks.filter((t) => t.date === iso && t.completed).length;
      const focus = data.pomodoros
        .filter((p) => p.date === iso && p.type === "focus" && p.completed)
        .reduce((acc, p) => acc + p.durationMin, 0);
      return {
        name: format(d, "EEE"),
        Tasks: done,
        Missed: Math.max(0, total - done),
        Focus: focus,
      };
    });
  }, [data.tasks, data.pomodoros]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-lg italic">This Week</h3>
          <p className="text-xs text-[var(--fg-soft)] mt-0.5">Tasks completed each day</p>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="var(--border-soft)" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--fg-soft)", fontSize: 11, fontFamily: "var(--font-inter)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--fg-soft)", fontSize: 11, fontFamily: "var(--font-inter)" }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "var(--accent-soft)", opacity: 0.4 }}
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-soft)",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "var(--font-inter)",
                color: "var(--fg)",
              }}
            />
            <Bar dataKey="Tasks" stackId="a" fill="var(--sage-500)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Missed" stackId="a" fill="var(--border)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
