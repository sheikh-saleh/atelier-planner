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
      description: "Three pages, stream of consciousness",
      date: today,
      time: "07:00",
      durationMin: 20,
      category: "work",
      completed: true,
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
    },
    {
      id: uid(),
      title: "Review quarterly goals",
      date: today,
      time: "09:00",
      durationMin: 30,
      category: "work",
      completed: true,
      createdAt: Date.now() - 1000 * 60 * 60 * 4,
    },
    {
      id: uid(),
      title: "Write for one hour",
      description: "Chapter 4 draft — the second act turning point",
      date: today,
      time: "10:00",
      durationMin: 60,
      category: "work",
      completed: true,
      createdAt: Date.now() - 1000 * 60 * 60 * 3,
    },
    {
      id: uid(),
      title: "Grocery run",
      description: "Eggs, coffee, greens, bread",
      date: today,
      time: "12:00",
      durationMin: 30,
      category: "errand",
      completed: true,
      createdAt: Date.now() - 1000 * 60 * 60 * 2,
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
      description: "Outline the second half before drafting",
      date: today,
      time: "15:00",
      durationMin: 90,
      category: "work",
      completed: false,
      createdAt: Date.now() - 1000 * 60 * 60,
    },
    {
      id: uid(),
      title: "Evening walk",
      description: "Thirty minutes, no headphones",
      date: today,
      time: "18:00",
      durationMin: 30,
      category: "health",
      completed: false,
      createdAt: Date.now(),
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
      completedDates: lastNDays(3),
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
  ];
}

function buildJournal(today: Date): Record<string, JournalEntry> {
  const entries: Record<string, JournalEntry> = {};

  entries[isoDate(today)] = {
    date: isoDate(today),
    mood: 4,
    content:
      "Felt grounded this morning. Wrote for an hour, then a long walk before lunch. The morning pages are starting to feel automatic — like the day begins before I begin it.",
    updatedAt: Date.now() - 1000 * 60 * 30,
  };

  entries[isoDate(subDays(today, 1))] = {
    date: isoDate(subDays(today, 1)),
    mood: 3,
    content:
      "Slow start. Revised the same paragraph four times before accepting it was done enough. Finished the chapter. Walked at dusk. A good day, if a quiet one.",
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
  };

  entries[isoDate(subDays(today, 2))] = {
    date: isoDate(subDays(today, 2)),
    mood: 5,
    content:
      "Best writing day in weeks. Fourteen hundred words by noon. The second act is finally taking shape. Celebrated with a long coffee and a bookshop visit.",
    updatedAt: Date.now() - 1000 * 60 * 60 * 48,
  };

  entries[isoDate(subDays(today, 3))] = {
    date: isoDate(subDays(today, 3)),
    mood: 2,
    content:
      "Struggled to start. Distracted by everything. Did the morning pages and the walk, but the writing never came. That happens. Tomorrow is another page.",
    updatedAt: Date.now() - 1000 * 60 * 60 * 72,
  };

  return entries;
}

function buildPomodoros(today: Date): PomodoroSession[] {
  const t = today;
  const baseTime = (offsetMin: number) => t.getTime() - offsetMin * 60 * 1000;
  return [
    // Today
    { id: uid(), date: isoDate(t), type: "focus", durationMin: 25, completed: true, startedAt: baseTime(180) },
    { id: uid(), date: isoDate(t), type: "short", durationMin: 5, completed: true, startedAt: baseTime(155) },
    { id: uid(), date: isoDate(t), type: "focus", durationMin: 25, completed: true, startedAt: baseTime(150) },
    { id: uid(), date: isoDate(t), type: "focus", durationMin: 25, completed: true, startedAt: baseTime(120) },
    // Yesterday
    { id: uid(), date: isoDate(subDays(t, 1)), type: "focus", durationMin: 25, completed: true, startedAt: baseTime(60 * 24 + 120) },
    { id: uid(), date: isoDate(subDays(t, 1)), type: "short", durationMin: 5, completed: true, startedAt: baseTime(60 * 24 + 95) },
    { id: uid(), date: isoDate(subDays(t, 1)), type: "focus", durationMin: 25, completed: true, startedAt: baseTime(60 * 24 + 90) },
    // 2 days ago
    { id: uid(), date: isoDate(subDays(t, 2)), type: "focus", durationMin: 50, completed: true, startedAt: baseTime(60 * 48 + 120) },
    { id: uid(), date: isoDate(subDays(t, 2)), type: "long", durationMin: 15, completed: true, startedAt: baseTime(60 * 48 + 70) },
    // 3 days ago
    { id: uid(), date: isoDate(subDays(t, 3)), type: "focus", durationMin: 25, completed: true, startedAt: baseTime(60 * 72 + 90) },
    { id: uid(), date: isoDate(subDays(t, 3)), type: "focus", durationMin: 25, completed: true, startedAt: baseTime(60 * 72 + 60) },
    // 4 days ago
    { id: uid(), date: isoDate(subDays(t, 4)), type: "focus", durationMin: 25, completed: true, startedAt: baseTime(60 * 96 + 90) },
    { id: uid(), date: isoDate(subDays(t, 4)), type: "short", durationMin: 5, completed: true, startedAt: baseTime(60 * 96 + 65) },
    { id: uid(), date: isoDate(subDays(t, 4)), type: "focus", durationMin: 25, completed: true, startedAt: baseTime(60 * 96 + 60) },
    // 5 days ago
    { id: uid(), date: isoDate(subDays(t, 5)), type: "focus", durationMin: 25, completed: true, startedAt: baseTime(60 * 120 + 90) },
    { id: uid(), date: isoDate(subDays(t, 5)), type: "focus", durationMin: 25, completed: true, startedAt: baseTime(60 * 120 + 60) },
    // 6 days ago
    { id: uid(), date: isoDate(subDays(t, 6)), type: "focus", durationMin: 50, completed: true, startedAt: baseTime(60 * 144 + 90) },
  ];
}

export function buildSeedData(): AppData {
  const today = startOfDay(new Date());
  return {
    tasks: buildTasks(isoDate(today)),
    habits: buildHabits(today),
    journal: buildJournal(today),
    pomodoros: buildPomodoros(today),
    settings: { ...defaultSettings, theme: "light" },
  };
}
