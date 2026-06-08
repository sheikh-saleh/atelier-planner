"use client";

import { Check, Flame, Pencil, Trash2, Archive, ArchiveRestore } from "lucide-react";
import * as Icons from "lucide-react";
import type { Habit } from "@/lib/types";
import { colorMap, cn } from "@/lib/utils";
import { computeStreak } from "@/lib/habitUtils";
import { useData } from "@/components/providers/DataProvider";

interface HabitItemProps {
  habit: Habit;
  date: string;
  onToggle: (id: string, iso: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export function HabitItem({ habit, date, onToggle, onEdit, onDelete }: HabitItemProps) {
  const completed = habit.completedDates.includes(date);
  const { current, best } = computeStreak(habit);
  const colors = colorMap[habit.color] ?? colorMap.sage;
  const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[habit.icon] ?? Icons.Activity;
  const { updateHabit } = useData();

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-lg border p-3.5 transition-all",
        completed ? colors.soft : "bg-[var(--bg-card)] hover:border-[var(--accent)]/40",
        habit.isArchived && "opacity-60 border-dashed"
      )}
      style={{ borderColor: "var(--border-soft)" }}
    >
      <button
        onClick={() => onToggle(habit.id, date)}
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-all",
          completed ? `${colors.bg} text-cream-50` : "border-2 border-dashed border-[var(--fg-muted)]/40 hover:border-[var(--accent)]",
        )}
        aria-label={completed ? "Unmark" : "Mark complete"}
        disabled={habit.isArchived}
      >
        {completed ? <Check className="h-4 w-4" strokeWidth={3} /> : <IconComp className="h-4 w-4 text-[var(--fg-muted)]" />}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-serif text-[15px] leading-snug",
            completed ? "text-[var(--fg-muted)] line-through" : "",
          )}
          style={{ color: completed ? undefined : "var(--fg)" }}
        >
          {habit.title}
        </p>
        {habit.description && (
          <p className="mt-0.5 text-xs text-[var(--fg-soft)] line-clamp-1">{habit.description}</p>
        )}
        {habit.notes && (
          <p className="mt-0.5 text-[10.5px] italic text-[var(--accent)] line-clamp-1">“{habit.notes}”</p>
        )}
      </div>

      <div className="hidden sm:flex items-center gap-3 mr-2">
        <div className="flex items-center gap-1 text-xs">
          <Flame className={cn("h-3.5 w-3.5", current > 0 ? "text-burgundy-300" : "text-[var(--fg-muted)]")} />
          <span className={cn("font-medium", current > 0 ? "text-burgundy-400" : "text-[var(--fg-muted)]")}>
            {current}
          </span>
        </div>
        {best > 0 && (
          <span className="text-[10px] uppercase tracking-wider text-[var(--fg-muted)]">best {best}</span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(habit)}
          className="rounded p-1.5 text-[var(--fg-soft)] hover:bg-cream-200 dark:hover:bg-ink-400"
          aria-label="Edit habit"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => updateHabit(habit.id, { isArchived: !habit.isArchived })}
          className="rounded p-1.5 text-[var(--fg-soft)] hover:bg-cream-200 dark:hover:bg-ink-400"
          aria-label={habit.isArchived ? "Restore habit" : "Archive habit"}
        >
          {habit.isArchived ? <ArchiveRestore className="h-3.5 w-3.5 text-sage-500" /> : <Archive className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={() => {
            if (confirm("Delete this habit and all its history?")) onDelete(habit.id);
          }}
          className="rounded p-1.5 text-[var(--fg-soft)] hover:bg-burgundy-50 hover:text-burgundy-400"
          aria-label="Delete habit"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
