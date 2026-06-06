"use client";

import { Header } from "@/components/layout/Header";
import { PomodoroTimer } from "@/components/timer/PomodoroTimer";
import { PomodoroSettings } from "@/components/timer/PomodoroSettings";

export default function TimerPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <Header
        title="Pomodoro"
        subtitle="Twenty-five minutes, deeply. Then rest."
      />
      <PomodoroTimer />
      <PomodoroSettings />
    </div>
  );
}
