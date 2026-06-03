import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const uid = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const colorMap: Record<string, { bg: string; text: string; border: string; soft: string }> = {
  sage: {
    bg: "bg-sage-300",
    text: "text-sage-500",
    border: "border-sage-300",
    soft: "bg-sage-100",
  },
  dusty: {
    bg: "bg-blue-dusty-300",
    text: "text-blue-dusty-500",
    border: "border-blue-dusty-300",
    soft: "bg-blue-dusty-50",
  },
  gold: {
    bg: "bg-gold-300",
    text: "text-gold-500",
    border: "border-gold-300",
    soft: "bg-gold-50",
  },
  burgundy: {
    bg: "bg-burgundy-300",
    text: "text-burgundy-400",
    border: "border-burgundy-300",
    soft: "bg-burgundy-50",
  },
  ink: {
    bg: "bg-ink-400",
    text: "text-ink-500",
    border: "border-ink-400",
    soft: "bg-ink-100",
  },
};

export const categoryMap: Record<string, { label: string; color: string; text: string; soft: string }> = {
  work: { label: "Work", color: "bg-blue-dusty-300", text: "text-blue-dusty-500", soft: "bg-blue-dusty-50" },
  personal: { label: "Personal", color: "bg-sage-300", text: "text-sage-500", soft: "bg-sage-100" },
  health: { label: "Health", color: "bg-burgundy-300", text: "text-burgundy-400", soft: "bg-burgundy-50" },
  leisure: { label: "Leisure", color: "bg-gold-300", text: "text-gold-500", soft: "bg-gold-50" },
  errand: { label: "Errand", color: "bg-ink-300", text: "text-ink-500", soft: "bg-ink-100" },
};
