"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { AppData, Habit, JournalEntry, JournalMoodUpdate, PomodoroConfig, PomodoroSession, Settings, Task } from "@/lib/types";
import { defaultData, defaultSettings, loadData, saveData } from "@/lib/storage";
import { buildSeedData, clearSeedFlag, isSeedRequested } from "@/lib/seed";
import { uid } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  pullAllData,
  syncTask,
  deleteTask as deleteTaskRemote,
  syncHabit,
  deleteHabit as deleteHabitRemote,
  syncJournal,
  syncPomodoro,
  syncSettings,
} from "@/lib/sync";

interface DataContextValue {
  data: AppData;
  hydrated: boolean;
  syncing: boolean;
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
  const { user } = useAuth();
  const [data, setData] = useState<AppData>(defaultData);
  const [hydrated, setHydrated] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const userIdRef = useRef<string | null>(null);
  const didPullRef = useRef(false);

  // ── Hydrate from localStorage on mount (or seed demo data if flagged) ──
  useEffect(() => {
    if (!user && isSeedRequested()) {
      setData(buildSeedData());
      clearSeedFlag();
    } else {
      setData(loadData());
    }
    setHydrated(true);
  }, [user]);

  // ── Save to localStorage on every change ──
  useEffect(() => {
    if (!hydrated) return;
    saveData(data);
  }, [data, hydrated]);

  // ── When user logs in: pull from Supabase, merge, then start syncing ──
  useEffect(() => {
    if (!hydrated || !user) {
      userIdRef.current = null;
      didPullRef.current = false;
      return;
    }

    const uid = user.id;
    userIdRef.current = uid;

    if (didPullRef.current) return;
    didPullRef.current = true;

    setSyncing(true);
    pullAllData(uid).then((remote) => {
      setData((local) => {
        const merged = { ...local };
        // Merge: Supabase wins for non-empty arrays, localStorage wins for empty
        if (remote.tasks && remote.tasks.length > 0) merged.tasks = remote.tasks;
        if (remote.habits && remote.habits.length > 0) merged.habits = remote.habits;
        if (remote.journal && Object.keys(remote.journal).length > 0) merged.journal = remote.journal;
        if (remote.pomodoros && remote.pomodoros.length > 0) merged.pomodoros = remote.pomodoros;
        if (remote.settings) merged.settings = remote.settings;
        return merged;
      });
      setSyncing(false);
    }).catch(() => {
      setSyncing(false);
    });
  }, [user, hydrated]);

  // ── When user logs out: reset pull flag ──
  useEffect(() => {
    if (!user) {
      didPullRef.current = false;
      userIdRef.current = null;
    }
  }, [user]);

  // ── Helper: fire-and-forget Supabase sync ──
  const sync = useCallback((fn: () => Promise<void>) => {
    if (!userIdRef.current) return;
    fn().catch(() => {});
  }, []);

  // ── Tasks ──

  const addTask: DataContextValue["addTask"] = useCallback((t) => {
    const task: Task = { ...t, id: uid(), completed: false, createdAt: Date.now() };
    setData((d) => ({ ...d, tasks: [...d.tasks, task] }));
    sync(() => syncTask(userIdRef.current!, task));
    return task;
  }, [sync]);

  const updateTask: DataContextValue["updateTask"] = useCallback((id, patch) => {
    setData((d) => {
      const updated = d.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
      const task = updated.find((t) => t.id === id);
      if (task) sync(() => syncTask(userIdRef.current!, task));
      return { ...d, tasks: updated };
    });
  }, [sync]);

  const deleteTask: DataContextValue["deleteTask"] = useCallback((id) => {
    setData((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) }));
    sync(() => deleteTaskRemote(userIdRef.current!, id));
  }, [sync]);

  const toggleTask: DataContextValue["toggleTask"] = useCallback((id) => {
    setData((d) => {
      const updated = d.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      const task = updated.find((t) => t.id === id);
      if (task) sync(() => syncTask(userIdRef.current!, task));
      return { ...d, tasks: updated };
    });
  }, [sync]);

  // ── Habits ──

  const addHabit: DataContextValue["addHabit"] = useCallback((h) => {
    const habit: Habit = { ...h, id: uid(), createdAt: Date.now(), completedDates: [] };
    setData((d) => ({ ...d, habits: [...d.habits, habit] }));
    sync(() => syncHabit(userIdRef.current!, habit));
    return habit;
  }, [sync]);

  const updateHabit: DataContextValue["updateHabit"] = useCallback((id, patch) => {
    setData((d) => {
      const updated = d.habits.map((h) => (h.id === id ? { ...h, ...patch } : h));
      const habit = updated.find((h) => h.id === id);
      if (habit) sync(() => syncHabit(userIdRef.current!, habit));
      return { ...d, habits: updated };
    });
  }, [sync]);

  const deleteHabit: DataContextValue["deleteHabit"] = useCallback((id) => {
    setData((d) => ({ ...d, habits: d.habits.filter((h) => h.id !== id) }));
    sync(() => deleteHabitRemote(userIdRef.current!, id));
  }, [sync]);

  const toggleHabitOnDate: DataContextValue["toggleHabitOnDate"] = useCallback((id, iso) => {
    setData((d) => {
      const updated = d.habits.map((h) => {
        if (h.id !== id) return h;
        const set = new Set(h.completedDates);
        if (set.has(iso)) set.delete(iso);
        else set.add(iso);
        return { ...h, completedDates: Array.from(set).sort() };
      });
      const habit = updated.find((h) => h.id === id);
      if (habit) sync(() => syncHabit(userIdRef.current!, habit));
      return { ...d, habits: updated };
    });
  }, [sync]);

  // ── Journal ──

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
      sync(() => syncJournal(userIdRef.current!, date, content, mood ?? "clear", entry.updatedAt));
      return { ...d, journal: { ...d.journal, [date]: entry } };
    });
  }, [sync]);

  // ── Pomodoro ──

  const logPomodoro: DataContextValue["logPomodoro"] = useCallback((s) => {
    const session: PomodoroSession = { ...s, id: uid() };
    setData((d) => ({ ...d, pomodoros: [...d.pomodoros, session] }));
    sync(() => syncPomodoro(userIdRef.current!, session));
  }, [sync]);

  // ── Settings ──

  const setSettings: DataContextValue["setSettings"] = useCallback((patch) => {
    setData((d) => {
      const next = { ...d.settings, ...patch };
      sync(() => syncSettings(userIdRef.current!, next));
      return { ...d, settings: next };
    });
  }, [sync]);

  const setPomodoroConfig: DataContextValue["setPomodoroConfig"] = useCallback((patch) => {
    setData((d) => {
      const next = { ...d.settings, pomodoro: { ...d.settings.pomodoro, ...patch } };
      sync(() => syncSettings(userIdRef.current!, next));
      return { ...d, settings: next };
    });
  }, [sync]);

  // ── Reset ──

  const resetAll: DataContextValue["resetAll"] = useCallback(() => {
    setData({ ...defaultData, settings: { ...defaultSettings } });
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({
      data,
      hydrated,
      syncing,
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
      syncing,
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
