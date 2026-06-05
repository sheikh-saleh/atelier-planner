"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useData } from "@/components/providers/DataProvider";
import type { PomodoroType } from "@/lib/types";
import { playChime, sendNotification } from "@/lib/notifications";
import { secondsToClock, todayISO } from "@/lib/dateUtils";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";

const labels: Record<PomodoroType, { title: string; sub: string; color: string }> = {
  focus: { title: "Focus", sub: "Deep work", color: "var(--burgundy-400)" },
  short: { title: "Short Break", sub: "Rest briefly", color: "var(--sage-500)" },
  long: { title: "Long Break", sub: "Step away", color: "var(--blue-dusty-500)" },
};

export function PomodoroTimer() {
  const { data, logPomodoro } = useData();
  const hydrated = useHydrated();
  const { focusMin, shortMin, longMin, cyclesUntilLong } = data.settings.pomodoro;
  const soundEnabled = data.settings.soundEnabled;

  const [type, setType] = useState<PomodoroType>("focus");
  const [secondsLeft, setSecondsLeft] = useState(focusMin * 60);
  const [running, setRunning] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const plannedDurationRef = useRef<number>(focusMin * 60);
  // Tracks the (type, cyclesCompleted) tuple of the last completion so side effects fire once
  const lastCompletedKeyRef = useRef<string>("");

  const durationFor = useCallback(
    (t: PomodoroType) => (t === "focus" ? focusMin * 60 : t === "short" ? shortMin * 60 : longMin * 60),
    [focusMin, shortMin, longMin],
  );

  const switchType = useCallback(
    (t: PomodoroType) => {
      setType(t);
      setSecondsLeft(durationFor(t));
      setRunning(false);
      startedAtRef.current = null;
      plannedDurationRef.current = durationFor(t);
      lastCompletedKeyRef.current = "";
    },
    [durationFor],
  );

  // Sync displayed time when settings change, but only if not running
  useEffect(() => {
    if (running) return;
    setSecondsLeft(durationFor(type));
    plannedDurationRef.current = durationFor(type);
  }, [durationFor, type, running]);

  // Timer tick (pure state update only)
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  // Handle completion: side effects run once per (type, cycle) tuple
  useEffect(() => {
    if (secondsLeft !== 0 || running) return;
    const key = `${type}-${cyclesCompleted}`;
    if (lastCompletedKeyRef.current === key) return;
    lastCompletedKeyRef.current = key;

    const elapsed = plannedDurationRef.current;
    logPomodoro({
      date: todayISO(),
      type,
      durationMin: Math.round(elapsed / 60),
      completed: true,
      startedAt: startedAtRef.current ?? Date.now(),
    });
    if (soundEnabled) playChime();
    sendNotification("Atelier", `${labels[type].title} complete.`);

    let next: PomodoroType;
    let nextCycles = cyclesCompleted;
    if (type === "focus") {
      nextCycles = cyclesCompleted + 1;
      next = nextCycles % cyclesUntilLong === 0 ? "long" : "short";
    } else {
      next = "focus";
    }
    setCyclesCompleted(nextCycles);
    setType(next);
    plannedDurationRef.current = durationFor(next);
    startedAtRef.current = null;
    setRunning(false);
    setSecondsLeft(durationFor(next));
  }, [secondsLeft, running, type, cyclesCompleted, cyclesUntilLong, soundEnabled, logPomodoro, durationFor]);

  // Tab title
  useEffect(() => {
    if (typeof document === "undefined") return;
    const base = "Atelier";
    document.title = running ? `${secondsToClock(secondsLeft)} · ${labels[type].title} — ${base}` : base;
    return () => {
      document.title = base;
    };
  }, [running, secondsLeft, type]);

  const handleStart = () => {
    if (!running && startedAtRef.current === null) {
      startedAtRef.current = Date.now();
    }
    setRunning(true);
  };

  const handlePause = () => setRunning(false);

  const handleReset = () => {
    setRunning(false);
    setSecondsLeft(durationFor(type));
    startedAtRef.current = null;
    lastCompletedKeyRef.current = "";
  };

  const handleSkip = () => {
    let next: PomodoroType = "short";
    if (type === "focus") {
      const nextCycles = cyclesCompleted + 1;
      setCyclesCompleted(nextCycles);
      next = nextCycles % cyclesUntilLong === 0 ? "long" : "short";
    } else if (type === "short") {
      next = "focus";
    } else {
      next = "focus";
    }
    startedAtRef.current = null;
    lastCompletedKeyRef.current = "";
    switchType(next);
  };

  const totalSec = durationFor(type);
  const progress = ((totalSec - secondsLeft) / totalSec) * 100;
  const cfg = labels[type];

  const todaySessions = useMemo(
    () => (hydrated ? data.pomodoros.filter((p) => p.date === todayISO() && p.completed) : []),
    [data.pomodoros, hydrated],
  );
  const focusMinutes = todaySessions.filter((p) => p.type === "focus").reduce((acc, s) => acc + s.durationMin, 0);

  return (
    <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
      <Card className="lg:col-span-2" paper>
        <div className="flex flex-col items-center py-4 sm:py-6">
          <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
            {(["focus", "short", "long"] as PomodoroType[]).map((t) => (
              <button
                key={t}
                onClick={() => switchType(t)}
                className={cn(
                  "px-2.5 sm:px-3 h-7 sm:h-8 text-[10px] sm:text-[11px] uppercase tracking-wider rounded-full font-medium transition-colors",
                  type === t
                    ? "bg-[var(--bg-card)] border border-[var(--accent)] text-[var(--fg)]"
                    : "text-[var(--fg-soft)] hover:text-[var(--fg)]",
                )}
              >
                {labels[t].title}
              </button>
            ))}
          </div>
          <p className="font-serif text-xs sm:text-sm italic text-[var(--fg-soft)] mb-4 sm:mb-6">{cfg.sub}</p>

          <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] lg:w-[300px] lg:h-[300px]">
            <ProgressRing
              value={progress}
              size={300}
              stroke={6}
              fillColor={cfg.color}
              trackColor="var(--border-soft)"
              className="!w-full !h-full"
              label={
                <div className="text-center">
                  <div className="font-display tnum text-6xl sm:text-7xl lg:text-8xl tracking-tighter leading-none" style={{ color: "var(--fg)" }}>
                    {secondsToClock(secondsLeft)}
                  </div>
                  <div className="mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[var(--fg-muted)]">
                    {type === "focus"
                      ? `Cycle ${(cyclesCompleted % cyclesUntilLong) + 1} of ${cyclesUntilLong}`
                      : cyclesCompleted % cyclesUntilLong === 0
                        ? "Long break"
                        : "Short break"}
                  </div>
                </div>
              }
            />
          </div>

          <div className="mt-6 sm:mt-8 flex items-center gap-2 sm:gap-3">
            <Button onClick={handleReset} size="sm" variant="ghost" aria-label="Reset">
              <RotateCcw className="h-4 w-4" />
            </Button>
            {running ? (
              <Button onClick={handlePause} size="md" variant="primary" className="px-6 sm:px-8">
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            ) : (
              <Button onClick={handleStart} size="md" variant="primary" className="px-6 sm:px-8">
                <Play className="h-4 w-4" />
                {secondsLeft === totalSec ? "Begin" : "Resume"}
              </Button>
            )}
            <Button onClick={handleSkip} size="sm" variant="ghost" aria-label="Skip">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

        </div>
      </Card>

      <div className="space-y-4 lg:space-y-4">
        <Card>
          <div className="font-serif text-[11px] uppercase tracking-[0.25em] text-[var(--fg-soft)] mb-2">
            Today
          </div>
          <div className="flex items-baseline gap-2">
            <div className="font-display tnum text-3xl sm:text-4xl" style={{ color: "var(--fg)" }}>
              {focusMinutes}
            </div>
            <div className="text-sm text-[var(--fg-soft)]">focus minutes</div>
          </div>
          <div className="mt-1 text-xs text-[var(--fg-muted)]">
            {todaySessions.filter((p) => p.type === "focus").length} sessions completed
          </div>
        </Card>

        <Card>
          <div className="font-serif text-[11px] uppercase tracking-[0.25em] text-[var(--fg-soft)] mb-3">
            Settings
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--fg-soft)]">Focus</span>
              <span className="font-medium tnum">{focusMin} min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--fg-soft)]">Short break</span>
              <span className="font-medium tnum">{shortMin} min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--fg-soft)]">Long break</span>
              <span className="font-medium tnum">{longMin} min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--fg-soft)]">Cycles to long</span>
              <span className="font-medium tnum">{cyclesUntilLong}</span>
            </div>
          </div>
          <p className="mt-3 text-[10px] italic text-[var(--fg-muted)]">
            Adjust in your browser settings.
          </p>
        </Card>
      </div>
    </div>
  );
}
