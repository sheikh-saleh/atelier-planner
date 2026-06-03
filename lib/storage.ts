import type { AppData, Settings } from "./types";

const STORAGE_KEY = "atelier-planner-v1";

export const defaultSettings: Settings = {
  theme: "light",
  notificationsEnabled: false,
  soundEnabled: true,
  pomodoro: {
    focusMin: 25,
    shortMin: 5,
    longMin: 15,
    cyclesUntilLong: 4,
  },
};

export const defaultData: AppData = {
  tasks: [],
  habits: [],
  journal: {},
  pomodoros: [],
  settings: defaultSettings,
};

export function loadData(): AppData {
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      ...defaultData,
      ...parsed,
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
    };
  } catch {
    return defaultData;
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data", e);
  }
}

export function exportData(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export function importData(json: string): AppData | null {
  try {
    const parsed = JSON.parse(json) as AppData;
    return { ...defaultData, ...parsed };
  } catch {
    return null;
  }
}
