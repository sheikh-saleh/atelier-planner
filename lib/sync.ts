import { supabase } from "@/lib/supabase";
import type { AppData, JournalMoodUpdate, JournalEntry } from "@/lib/types";

const TABLES = {
  tasks: "tasks",
  habits: "habits",
  journal: "journal_entries",
  pomodoros: "pomodoro_sessions",
  settings: "user_settings",
} as const;

// ── Pull all data from Supabase ──

export async function pullAllData(userId: string): Promise<Partial<AppData>> {
  const [tasksRes, habitsRes, journalRes, pomodorosRes, settingsRes] = await Promise.all([
    supabase.from(TABLES.tasks).select("*").eq("user_id", userId),
    supabase.from(TABLES.habits).select("*").eq("user_id", userId),
    supabase.from(TABLES.journal).select("*").eq("user_id", userId),
    supabase.from(TABLES.pomodoros).select("*").eq("user_id", userId),
    supabase.from(TABLES.settings).select("*").eq("user_id", userId).single(),
  ]);

  const tasks = (tasksRes.data ?? []).map((r: any) => ({
    id: r.id,
    title: r.title,
    description: r.description ?? undefined,
    date: r.date,
    time: r.time ?? undefined,
    durationMin: r.duration_min ?? undefined,
    category: r.category,
    completed: r.completed,
    createdAt: r.created_at,
  }));

  const habits = (habitsRes.data ?? []).map((r: any) => ({
    id: r.id,
    title: r.title,
    description: r.description ?? undefined,
    icon: r.icon,
    color: r.color,
    frequency: r.frequency,
    customDays: r.custom_days ?? undefined,
    completedDates: r.completed_dates ?? [],
    createdAt: r.created_at,
  }));

  const journal: AppData["journal"] = {};
  for (const r of journalRes.data ?? []) {
    journal[r.date] = {
      date: r.date,
      content: r.content,
      mood: r.mood ?? undefined,
      updatedAt: r.updated_at,
    };
  }

  const pomodoros = (pomodorosRes.data ?? []).map((r: any) => ({
    id: r.id,
    date: r.date,
    type: r.type,
    durationMin: r.duration_min,
    completed: r.completed,
    startedAt: r.started_at,
  }));

  let settings: AppData["settings"] | undefined;
  if (settingsRes.data) {
    const s = settingsRes.data.settings;
    settings = {
      theme: s.theme ?? "light",
      notificationsEnabled: s.notifications_enabled ?? false,
      soundEnabled: s.sound_enabled ?? true,
      pomodoro: s.pomodoro ?? { focusMin: 25, shortMin: 5, longMin: 15, cyclesUntilLong: 4 },
    };
  }

  return { tasks, habits, journal, pomodoros, ...(settings ? { settings } : {}) };
}

// ── Push helpers (insert-or-upsert) ──

function row(userId: string, data: Record<string, unknown>) {
  return { user_id: userId, ...data };
}

export async function syncTask(userId: string, task: AppData["tasks"][number]) {
  await supabase.from(TABLES.tasks).upsert(
    row(userId, {
      id: task.id,
      title: task.title,
      description: task.description ?? null,
      date: task.date,
      time: task.time ?? null,
      duration_min: task.durationMin ?? null,
      category: task.category,
      completed: task.completed,
      created_at: task.createdAt,
    }),
    { onConflict: "id" },
  );
}

export async function deleteTask(userId: string, taskId: string) {
  await supabase.from(TABLES.tasks).delete().eq("id", taskId).eq("user_id", userId);
}

export async function syncHabit(userId: string, habit: AppData["habits"][number]) {
  await supabase.from(TABLES.habits).upsert(
    row(userId, {
      id: habit.id,
      title: habit.title,
      description: habit.description ?? null,
      icon: habit.icon,
      color: habit.color,
      frequency: habit.frequency,
      custom_days: habit.customDays ?? null,
      completed_dates: habit.completedDates,
      created_at: habit.createdAt,
    }),
    { onConflict: "id" },
  );
}

export async function deleteHabit(userId: string, habitId: string) {
  await supabase.from(TABLES.habits).delete().eq("id", habitId).eq("user_id", userId);
}

export async function syncJournal(
  userId: string,
  date: string,
  content: string,
  mood: JournalMoodUpdate,
  updatedAt: number,
) {
  const moodValue = mood === "clear" ? null : mood ?? null;
  await supabase.from(TABLES.journal).upsert(
    row(userId, {
      id: `${userId}-${date}`,
      date,
      content,
      mood: moodValue,
      updated_at: updatedAt,
    }),
    { onConflict: "user_id,date" },
  );
}

export async function syncPomodoro(userId: string, session: AppData["pomodoros"][number]) {
  await supabase.from(TABLES.pomodoros).upsert(
    row(userId, {
      id: session.id,
      date: session.date,
      type: session.type,
      duration_min: session.durationMin,
      completed: session.completed,
      started_at: session.startedAt,
    }),
    { onConflict: "id" },
  );
}

export async function syncSettings(userId: string, settings: AppData["settings"]) {
  await supabase.from(TABLES.settings).upsert(
    row(userId, {
      user_id: userId,
      settings: {
        theme: settings.theme,
        notifications_enabled: settings.notificationsEnabled,
        sound_enabled: settings.soundEnabled,
        pomodoro: settings.pomodoro,
      },
      updated_at: new Date().toISOString(),
    }),
    { onConflict: "user_id" },
  );
}
