"use client";

import { Header } from "@/components/layout/Header";
import { TaskList } from "@/components/tasks/TaskList";
import { HabitList } from "@/components/habits/HabitList";
import { JournalEditor } from "@/components/journal/JournalEditor";
import { TodayProgress } from "@/components/stats/TodayProgress";
import { Card } from "@/components/ui/Card";
import { greeting, todayISO } from "@/lib/dateUtils";
import { useHydrated } from "@/hooks/useHydrated";
import { AnimatedPage } from "@/components/motion";

export default function TodayPage() {
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <AnimatedPage>
        <div className="space-y-4">
          <Header title="Atelier" showDate={false} />
          <div className="h-32 rounded-xl bg-cream-200 dark:bg-ink-400 animate-pulse" />
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="h-96 rounded-xl bg-cream-200 dark:bg-ink-400 animate-pulse" />
            <div className="h-96 rounded-xl bg-cream-200 dark:bg-ink-400 animate-pulse" />
          </div>
        </div>
      </AnimatedPage>
    );
  }

  const today = todayISO();

  return (
    <AnimatedPage>
      <div className="space-y-6 sm:space-y-8">
        <Header
          title={`${greeting()}.`}
          subtitle="A small daily practice, repeated faithfully."
        />

        <TodayProgress />

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <TaskList date={today} />
          </div>
          <div className="space-y-6">
            <Card padded={false}>
              <div className="p-5 sm:p-6">
                <HabitList />
              </div>
            </Card>
            <JournalEditor date={today} compact />
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
