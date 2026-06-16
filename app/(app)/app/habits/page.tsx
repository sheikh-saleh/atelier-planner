"use client";

import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { HabitList } from "@/components/habits/HabitList";
import { StreakLeaderboard } from "@/components/stats/StreakLeaderboard";
import { AnimatedPage } from "@/components/motion";

export default function HabitsPage() {
  useEffect(() => {
    const handleNewHabit = () => {
      document.dispatchEvent(new CustomEvent("atelier:open-new-habit"));
    };
    window.addEventListener("atelier:new-habit", handleNewHabit);
    return () => window.removeEventListener("atelier:new-habit", handleNewHabit);
  }, []);

  return (
    <AnimatedPage>
      <div className="space-y-6 sm:space-y-8">
        <Header
          title="Habits"
          subtitle="The architecture of a life is built one quiet day at a time."
        />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HabitList />
          </div>
          <div>
            <StreakLeaderboard />
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
