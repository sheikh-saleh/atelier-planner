import { format, isToday, isYesterday, parseISO, startOfDay } from "date-fns";

export const todayISO = (): string => format(startOfDay(new Date()), "yyyy-MM-dd");

export const formatDate = (iso: string, fmt = "EEEE, MMMM d, yyyy"): string =>
  format(parseISO(iso), fmt);

export const formatTime = (time?: string): string => {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${m.toString().padStart(2, "0")} ${period}`;
};

export const getTimeOfDay = (time?: string): "morning" | "afternoon" | "evening" | "unscheduled" => {
  if (!time) return "unscheduled";
  const h = parseInt(time.split(":")[0], 10);
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
};

export const greeting = (): string => {
  const h = new Date().getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
};

export const relativeDay = (iso: string): string => {
  const d = parseISO(iso);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d, yyyy");
};

export const minutesToHM = (mins: number): string => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export const secondsToClock = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export const dayName = (iso: string, fmt = "EEE"): string => format(parseISO(iso), fmt);

export const monthName = (iso: string, fmt = "MMMM"): string => format(parseISO(iso), fmt);
