import { format, startOfDay, subDays, isWeekend } from "date-fns";
import type { AppData, Habit, PomodoroSession, Task, JournalEntry } from "./types";
import { defaultSettings } from "./storage";

const SEED_FLAG_KEY = "atelier-demo-seed";

export function isSeedRequested(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SEED_FLAG_KEY) === "1";
}

export function clearSeedFlag(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SEED_FLAG_KEY);
}

function isoDate(d: Date): string {
  return format(startOfDay(d), "yyyy-MM-dd");
}

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildTasks(today: string): Task[] {
  return [
    {
      id: uid(),
      title: "Morning pages",
      date: today,
      time: "07:00",
      durationMin: 20,
      category: "work",
      completed: true,
      createdAt: Date.now() - 1000 * 60 * 60 * 4,
    },
    {
      id: uid(),
      title: "Review quarterly goals",
      date: today,
      time: "09:30",
      durationMin: 45,
      category: "work",
      completed: true,
      createdAt: Date.now() - 1000 * 60 * 60 * 3,
    },
    {
      id: uid(),
      title: "Lunch with Sam",
      description: "Cafe Lumen, 12:30",
      date: today,
      time: "12:30",
      durationMin: 60,
      category: "personal",
      completed: false,
      createdAt: Date.now() - 1000 * 60 * 60 * 2,
    },
    {
      id: uid(),
      title: "Draft chapter outline",
      date: today,
      time: "15:00",
      durationMin: 90,
      category: "work",
      completed: false,
      createdAt: Date.now() - 1000 * 60 * 60,
    },
  ];
}

function buildHabits(today: Date): Habit[] {
  const lastNDays = (n: number): string[] => {
    const out: string[] = [];
    for (let i = 0; i < n; i++) out.push(isoDate(subDays(today, i)));
    return out;
  };
  const lastWeekdays = (n: number): string[] => {
    const out: string[] = [];
    let cursor = new Date(today);
    while (out.length < n) {
      if (!isWeekend(cursor)) out.push(isoDate(cursor));
      cursor = subDays(cursor, 1);
    }
    return out;
  };

  return [
    {
      id: uid(),
      title: "Read 20 minutes",
      description: "One chapter, no phone",
      icon: "BookOpen",
      color: "sage",
      frequency: "daily",
      completedDates: lastNDays(12),
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    },
    {
      id: uid(),
      title: "Walk 8k steps",
      description: "Outside, not on the treadmill",
      icon: "Footprints",
      color: "dusty",
      frequency: "daily",
      completedDates: lastNDays(5),
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
    },
    {
      id: uid(),
      title: "Meditate 10 min",
      description: "Headspace, weekdays only",
      icon: "Wind",
      color: "gold",
      frequency: "weekdays",
      completedDates: lastWeekdays(3),
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    },
    {
      id: uid(),
      title: "No phone first hour",
      icon: "Smartphone",
      color: "burgundy",
      frequency: "daily",
      completedDates: [isoDate(today)],
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    },
  ];
}

function buildJournal(today: string): Record<string, JournalEntry> {
  return {
    [today]: {
      date: today,
      mood: 4,
      content:
        "Felt grounded this morning. Wrote for an hour, then a long walk before lunch. The morning pages are starting to feel automatic — like the day begins before I begin it.",
      updatedAt: Date.now() - 1000 * 60 * 30,
    },
  };
}

function buildPomodoros(today: Date): PomodoroSession[] {
  const t = today;
  const baseTime = (offsetMin: number) => t.getTime() - offsetMin * 60 * 1000;
  return [
    { id: uid(), date: isoDate(t), type: "focus", durationMin: 25, completed: true, startedAt: baseTime(150) },
    { id: uid(), date: isoDate(t), type: "short", durationMin: 5, completed: true, startedAt: baseTime(125) },
    { id: uid(), date: isoDate(t), type: "focus", durationMin: 25, completed: true, startedAt: baseTime(120) },
    { id: uid(), date: isoDate(subDays(t, 1)), type: "focus", durationMin: 25, completed: true, startedAt: baseTime(60 * 24 + 90) },
    { id: uid(), date: isoDate(subDays(t, 1)), type: "focus", durationMin: 25, completed: true, startedAt: baseTime(60 * 24 + 60) },
    { id: uid(), date: isoDate(subDays(t, 2)), type: "focus", durationMin: 50, completed: true, startedAt: baseTime(60 * 48 + 60) },
  ];
}

export function buildSeedData(): AppData {
  const today = startOfDay(new Date());
  return {
    tasks: buildTasks(isoDate(today)),
    habits: buildHabits(today),
    journal: buildJournal(isoDate(today)),
    pomodoros: buildPomodoros(today),
    settings: { ...defaultSettings, theme: "light" },
  };
}
