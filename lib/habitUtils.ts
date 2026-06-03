import { addDays, differenceInCalendarDays, format, parseISO, startOfDay } from "date-fns";
import type { Habit } from "./types";
import { todayISO } from "./dateUtils";

const isScheduled = (habit: Habit, iso: string): boolean => {
  if (habit.frequency === "daily") return true;
  const dow = parseISO(iso).getDay();
  if (habit.frequency === "weekdays") return dow >= 1 && dow <= 5;
  if (habit.frequency === "weekends") return dow === 0 || dow === 6;
  if (habit.frequency === "custom" && habit.customDays) return habit.customDays.includes(dow);
  return true;
};

export const computeStreak = (habit: Habit): { current: number; best: number } => {
  if (habit.completedDates.length === 0) return { current: 0, best: 0 };

  const sorted = [...habit.completedDates].sort();
  const dateSet = new Set(sorted);

  // Best streak: walk forward from first completion, only counting scheduled days.
  // For non-daily habits, unscheduled days are skipped, not streak-breakers.
  let best = 0;
  let run = 0;
  const first = parseISO(sorted[0]);
  const last = parseISO(sorted[sorted.length - 1]);
  const totalDays = differenceInCalendarDays(last, first) + 1;
  for (let i = 0; i < totalDays; i++) {
    const d = format(addDays(first, i), "yyyy-MM-dd");
    if (!isScheduled(habit, d)) continue;
    if (dateSet.has(d)) {
      run++;
      if (run > best) best = run;
    } else {
      run = 0;
    }
  }

  // Current streak: walk back from today (or yesterday) only counting on scheduled days
  let current = 0;
  const today = startOfDay(new Date());

  let cursor = today;
  // If today not scheduled or not done, start from yesterday if it was scheduled+done
  if (!isScheduled(habit, format(cursor, "yyyy-MM-dd")) || !dateSet.has(format(cursor, "yyyy-MM-dd"))) {
    cursor = addDays(cursor, -1);
  }
  while (true) {
    const iso = format(cursor, "yyyy-MM-dd");
    if (!isScheduled(habit, iso)) {
      cursor = addDays(cursor, -1);
      if (differenceInCalendarDays(today, cursor) > 365) break;
      continue;
    }
    if (dateSet.has(iso)) {
      current++;
      cursor = addDays(cursor, -1);
    } else {
      break;
    }
    if (current > 365) break;
  }

  return { current, best };
};

export const isHabitScheduledOn = isScheduled;

export const isHabitCompletedOn = (habit: Habit, iso: string): boolean =>
  habit.completedDates.includes(iso);

export const toggleHabitOnDate = (habit: Habit, iso: string): Habit => {
  const set = new Set(habit.completedDates);
  if (set.has(iso)) set.delete(iso);
  else set.add(iso);
  return { ...habit, completedDates: Array.from(set).sort() };
};

export const completionRateLast30 = (habit: Habit): number => {
  const today = startOfDay(new Date());
  let scheduled = 0;
  let done = 0;
  for (let i = 0; i < 30; i++) {
    const d = format(addDays(today, -i), "yyyy-MM-dd");
    if (isHabitScheduledOn(habit, d)) {
      scheduled++;
      if (habit.completedDates.includes(d)) done++;
    }
  }
  return scheduled === 0 ? 0 : Math.round((done / scheduled) * 100);
};

export const todayKey = todayISO;
