export type Category = "work" | "personal" | "health" | "leisure" | "errand";

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO yyyy-MM-dd
  time?: string; // HH:mm
  durationMin?: number;
  category: Category;
  completed: boolean;
  createdAt: number;
  priority?: "low" | "medium" | "high";
}

export type Frequency = "daily" | "weekdays" | "weekends" | "custom";

export interface Habit {
  id: string;
  title: string;
  description?: string;
  icon: string; // lucide icon name
  color: string; // tailwind/text color key
  frequency: Frequency;
  customDays?: number[]; // 0=Sun..6=Sat
  completedDates: string[]; // ISO dates
  createdAt: number;
  isArchived?: boolean;
  notes?: string;
}

export interface JournalEntry {
  date: string; // ISO
  content: string;
  mood?: 1 | 2 | 3 | 4 | 5;
  updatedAt: number;
}

export type PomodoroType = "focus" | "short" | "long";

export interface PomodoroSession {
  id: string;
  date: string; // ISO
  type: PomodoroType;
  durationMin: number;
  completed: boolean;
  startedAt: number;
}

export interface PomodoroConfig {
  focusMin: number;
  shortMin: number;
  longMin: number;
  cyclesUntilLong: number;
  autoStartBreaks?: boolean;
  autoStartFocus?: boolean;
}

// Discriminated union for journal updates: "no change" vs "explicit clear" vs "set value"
export type JournalMoodUpdate = JournalEntry["mood"] | "clear";

export interface Settings {
  theme: "light" | "dark";
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  pomodoro: PomodoroConfig;
  soundType?: "chime" | "bell" | "digital" | "gong";
}

export interface AppData {
  tasks: Task[];
  habits: Habit[];
  journal: Record<string, JournalEntry>;
  pomodoros: PomodoroSession[];
  settings: Settings;
}
