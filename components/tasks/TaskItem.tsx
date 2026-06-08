"use client";

import { Check, Clock, Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/lib/types";
import { categoryMap, cn } from "@/lib/utils";
import { formatTime } from "@/lib/dateUtils";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const cat = categoryMap[task.category];
  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-lg border p-3.5 transition-all",
        task.completed
          ? "bg-cream-100/40 dark:bg-ink-400/30"
          : "bg-[var(--bg-card)] hover:border-[var(--accent)]/40",
        task.priority === "high" && !task.completed && "border-l-[3px] border-l-gold-300",
      )}
      style={{ borderColor: task.completed ? "var(--border-soft)" : "var(--border-soft)" }}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          task.completed
            ? "bg-sage-300 border-sage-300 text-cream-50"
            : "border-[var(--fg-muted)] hover:border-[var(--accent)]",
        )}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed && <Check className="h-3 w-3" strokeWidth={3} />}
      </button>
 
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "font-serif text-[15px] leading-snug",
                task.completed && "line-through text-[var(--fg-muted)]",
              )}
              style={{ color: task.completed ? undefined : "var(--fg)" }}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="mt-0.5 text-xs text-[var(--fg-soft)] line-clamp-2">{task.description}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[var(--fg-soft)]">
              {task.time && (
                <span className="inline-flex items-center gap-1 font-medium">
                  <Clock className="h-3 w-3" />
                  {formatTime(task.time)}
                </span>
              )}
              {task.durationMin && <span className="opacity-70">· {task.durationMin} min</span>}
              {task.priority && task.priority !== "medium" && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded px-1.5 py-0.25 text-[9px] font-medium uppercase tracking-wider border",
                    task.priority === "high"
                      ? "bg-gold-50/50 text-gold-500 border-gold-200/50"
                      : "bg-ink-50/50 text-ink-300 border-ink-100/50"
                  )}
                >
                  {task.priority}
                </span>
              )}
              <span
                className={cn(
                  "ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                  cat.soft,
                  cat.text,
                )}
              >
                {cat.label}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="rounded p-1.5 text-[var(--fg-soft)] hover:bg-cream-200 dark:hover:bg-ink-400"
              aria-label="Edit task"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="rounded p-1.5 text-[var(--fg-soft)] hover:bg-burgundy-50 hover:text-burgundy-400"
              aria-label="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
