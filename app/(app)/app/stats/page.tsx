"use client";

import { Header } from "@/components/layout/Header";
import { WeeklyChart } from "@/components/stats/WeeklyChart";
import { HabitHeatmap } from "@/components/stats/HabitHeatmap";
import { StreakLeaderboard } from "@/components/stats/StreakLeaderboard";
import { TodayProgress } from "@/components/stats/TodayProgress";
import { AnimatedPage } from "@/components/motion";

export default function StatsPage() {
  return (
    <AnimatedPage>
      <div className="space-y-6 sm:space-y-8">
        <Header
          title="Insights"
          subtitle="What gets measured gets tended."
        />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WeeklyChart />
            <HabitHeatmap />
          </div>
          <div className="space-y-6">
            <TodayProgress />
            <StreakLeaderboard />
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
