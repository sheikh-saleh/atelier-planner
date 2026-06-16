"use client";

import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { PomodoroTimer } from "@/components/timer/PomodoroTimer";
import { PomodoroSettings } from "@/components/timer/PomodoroSettings";
import { AnimatedPage } from "@/components/motion";

export default function TimerPage() {
  useEffect(() => {
    const handleToggleTimer = () => {
      document.dispatchEvent(new CustomEvent("atelier:toggle-timer"));
    };
    window.addEventListener("atelier:toggle-timer", handleToggleTimer);
    return () => window.removeEventListener("atelier:toggle-timer", handleToggleTimer);
  }, []);

  return (
    <AnimatedPage>
      <div className="space-y-6 sm:space-y-8">
        <Header
          title="Pomodoro"
          subtitle="Twenty-five minutes, deeply. Then rest."
        />
        <PomodoroTimer />
        <PomodoroSettings />
      </div>
    </AnimatedPage>
  );
}
