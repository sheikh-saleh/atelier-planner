"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { CalendarGrid } from "@/components/schedule/CalendarGrid";
import { DayPanel } from "@/components/schedule/DayPanel";
import { Card } from "@/components/ui/Card";
import { AnimatedPage } from "@/components/motion";
import { useData } from "@/components/providers/DataProvider";
import { useHydrated } from "@/hooks/useHydrated";

export default function SchedulePage() {
  const hydrated = useHydrated();
  const { data } = useData();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  if (!hydrated) {
    return (
      <AnimatedPage>
        <div className="space-y-4">
          <Header title="Schedule" showDate={false} />
          <div className="h-96 rounded-xl bg-cream-200 dark:bg-ink-400 animate-pulse" />
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-6 sm:space-y-8">
        <Header
          title="Schedule"
          subtitle="Plan your days ahead."
          showDate={false}
        />

        <Card padded={false}>
          <div className="p-5 sm:p-6">
            <CalendarGrid
              year={year}
              month={month}
              tasks={data.tasks}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
          </div>
        </Card>

        <DayPanel date={selectedDate} onClose={() => setSelectedDate(null)} />
      </div>
    </AnimatedPage>
  );
}
