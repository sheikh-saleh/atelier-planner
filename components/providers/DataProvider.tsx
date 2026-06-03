"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AppData, Habit, JournalEntry, JournalMoodUpdate, PomodoroConfig, PomodoroSession, Settings, Task } from "@/lib/types";
import { defaultData, defaultSettings, loadData, saveData } from "@/lib/storage";
import { uid } from "@/lib/utils";

interface DataContextValue {
  data: AppData;
  hydrated: boolean;
  // tasks
  addTask: (t: Omit<Task, "id" | "createdAt" | "completed">) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  // habits
  addHabit: (h: Omit<Habit, "id" | "createdAt" | "completedDates">) => Habit;
  updateHabit: (id: string, patch: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitOnDate: (id: string, iso: string) => void;
  // journal
  setJournal: (date: string, content: string, mood?: JournalMoodUpdate) => void;
  // pomodoro
  logPomodoro: (s: Omit<PomodoroSession, "id">) => void;
  // settings
  setSettings: (patch: Partial<Settings>) => void;
  setPomodoroConfig: (patch: Partial<PomodoroConfig>) => void;
  // util
  resetAll: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(defaultData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadData());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveData(data);
  }, [data, hydrated]);

  const addTask: DataContextValue["addTask"] = useCallback((t) => {
    const task: Task = { ...t, id: uid(), completed: false, createdAt: Date.now() };
    setData((d) => ({ ...d, tasks: [...d.tasks, task] }));
    return task;
  }, []);

  const updateTask: DataContextValue["updateTask"] = useCallback((id, patch) => {
    setData((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
  }, []);

  const deleteTask: DataContextValue["deleteTask"] = useCallback((id) => {
    setData((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) }));
  }, []);

  const toggleTask: DataContextValue["toggleTask"] = useCallback((id) => {
    setData((d) => ({
      ...d,
      tasks: d.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  }, []);

  const addHabit: DataContextValue["addHabit"] = useCallback((h) => {
    const habit: Habit = { ...h, id: uid(), createdAt: Date.now(), completedDates: [] };
    setData((d) => ({ ...d, habits: [...d.habits, habit] }));
    return habit;
  }, []);

  const updateHabit: DataContextValue["updateHabit"] = useCallback((id, patch) => {
    setData((d) => ({ ...d, habits: d.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)) }));
  }, []);

  const deleteHabit: DataContextValue["deleteHabit"] = useCallback((id) => {
    setData((d) => ({ ...d, habits: d.habits.filter((h) => h.id !== id) }));
  }, []);

  const toggleHabitOnDate: DataContextValue["toggleHabitOnDate"] = useCallback((id, iso) => {
    setData((d) => ({
      ...d,
      habits: d.habits.map((h) => {
        if (h.id !== id) return h;
        const set = new Set(h.completedDates);
        if (set.has(iso)) set.delete(iso);
        else set.add(iso);
        return { ...h, completedDates: Array.from(set).sort() };
      }),
    }));
  }, []);

  const setJournal: DataContextValue["setJournal"] = useCallback((date, content, mood) => {
    setData((d) => {
      const prev = d.journal[date];
      const nextMood: JournalEntry["mood"] | undefined =
        mood === "clear" ? undefined : mood === undefined ? prev?.mood : mood;
      const entry: JournalEntry = {
        date,
        content,
        mood: nextMood,
        updatedAt: Date.now(),
      };
      return { ...d, journal: { ...d.journal, [date]: entry } };
    });
  }, []);

  const logPomodoro: DataContextValue["logPomodoro"] = useCallback((s) => {
    const session: PomodoroSession = { ...s, id: uid() };
    setData((d) => ({ ...d, pomodoros: [...d.pomodoros, session] }));
  }, []);

  const setSettings: DataContextValue["setSettings"] = useCallback((patch) => {
    setData((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
  }, []);

  const setPomodoroConfig: DataContextValue["setPomodoroConfig"] = useCallback((patch) => {
    setData((d) => ({
      ...d,
      settings: { ...d.settings, pomodoro: { ...d.settings.pomodoro, ...patch } },
    }));
  }, []);

  const resetAll: DataContextValue["resetAll"] = useCallback(() => {
    setData({ ...defaultData, settings: { ...defaultSettings } });
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({
      data,
      hydrated,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabitOnDate,
      setJournal,
      logPomodoro,
      setSettings,
      setPomodoroConfig,
      resetAll,
    }),
    [
      data,
      hydrated,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabitOnDate,
      setJournal,
      logPomodoro,
      setSettings,
      setPomodoroConfig,
      resetAll,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
