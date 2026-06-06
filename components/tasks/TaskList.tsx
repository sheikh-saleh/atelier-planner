"use client";

import { useMemo, useState } from "react";
import { Plus, Sun, Sunset, Sunrise, Coffee, Inbox } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TaskItem } from "./TaskItem";
import { TaskForm } from "./TaskForm";
import { useData } from "@/components/providers/DataProvider";
import type { Task } from "@/lib/types";
import { getTimeOfDay, todayISO } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";

type Slot = "morning" | "afternoon" | "evening" | "unscheduled";

const slotConfig: Record<Slot, { label: string; icon: React.ComponentType<{ className?: string }>; serif: string }> = {
  morning: { label: "Morning", icon: Sunrise, serif: "Matins" },
  afternoon: { label: "Afternoon", icon: Sun, serif: "Afternoon" },
  evening: { label: "Evening", icon: Sunset, serif: "Vespers" },
  unscheduled: { label: "Anytime", icon: Inbox, serif: "Anytime" },
};

const slotOrder: Slot[] = ["morning", "afternoon", "evening", "unscheduled"];

interface TaskListProps {
  date?: string;
  showAdd?: boolean;
  emptyMessage?: string;
  filterCompleted?: boolean;
}

export function TaskList({ date, showAdd = true, emptyMessage, filterCompleted }: TaskListProps) {
  const theDate = date ?? todayISO();
  const { data, addTask, updateTask, deleteTask, toggleTask } = useData();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const tasks = useMemo(
    () =>
      data.tasks
        .filter((t) => t.date === theDate)
        .filter((t) => (filterCompleted ? !t.completed : true))
        .sort((a, b) => {
          if (a.time && b.time) return a.time.localeCompare(b.time);
          if (a.time) return -1;
          if (b.time) return 1;
          return a.createdAt - b.createdAt;
        }),
    [data.tasks, theDate, filterCompleted],
  );

  const grouped = useMemo(() => {
    const g: Record<Slot, Task[]> = {
      morning: [],
      afternoon: [],
      evening: [],
      unscheduled: [],
    };
    for (const t of tasks) {
      g[getTimeOfDay(t.time)].push(t);
    }
    return g;
  }, [tasks]);

  const handleEdit = (task: Task) => {
    setEditing(task);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this task?")) deleteTask(id);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div>
      {showAdd && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4">
          <div>
            <h2 className="font-serif text-xl italic">Schedule</h2>
            <p className="text-xs text-[var(--fg-soft)] mt-0.5">
              {totalCount === 0
                ? "Nothing planned"
                : `${completedCount} of ${totalCount} complete`}
            </p>
          </div>
          <Button onClick={() => setFormOpen(true)} size="sm" variant="primary" className="self-start sm:self-auto">
            <Plus className="h-3.5 w-3.5" />
            <span className="sm:hidden">Add</span>
            <span className="hidden sm:inline">New Task</span>
          </Button>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed py-10 text-center" style={{ borderColor: "var(--border)" }}>
          <Coffee className="mx-auto h-6 w-6 text-[var(--fg-muted)]" strokeWidth={1.2} />
          <p className="mt-2 font-serif text-sm italic text-[var(--fg-soft)]">
            {emptyMessage ?? "A quiet day. Add something to begin."}
          </p>
          {showAdd && (
            <Button onClick={() => setFormOpen(true)} size="sm" variant="secondary" className="mt-3">
              <Plus className="h-3.5 w-3.5" />
              Add Task
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {slotOrder.map((slot) => {
            const list = grouped[slot];
            if (list.length === 0) return null;
            const cfg = slotConfig[slot];
            const Icon = cfg.icon;
            return (
              <section key={slot}>
                <div className="flex items-center gap-2 mb-2.5">
                  <Icon className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <h3 className="font-serif text-[11px] uppercase tracking-[0.25em] text-[var(--fg-soft)]">
                    {cfg.serif}
                  </h3>
                  <div className="flex-1 h-px" style={{ background: "var(--border-soft)" }} />
                  <span className="text-[10px] font-medium text-[var(--fg-muted)]">{list.length}</span>
                </div>
                <div className="space-y-2">
                  {list.map((t) => (
                    <TaskItem
                      key={t.id}
                      task={t}
                      onToggle={toggleTask}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <TaskForm open={formOpen} onClose={handleClose} initial={editing ?? undefined} defaultDate={theDate} />
    </div>
  );
}
