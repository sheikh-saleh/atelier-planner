"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, ArchiveRestore } from "lucide-react";
import { addMonths, format, subMonths } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HabitItem } from "./HabitItem";
import { HabitForm } from "./HabitForm";
import { HabitCalendar } from "./HabitCalendar";
import { useData } from "@/components/providers/DataProvider";
import type { Habit } from "@/lib/types";
import { computeStreak, isHabitCompletedOn, isHabitScheduledOn } from "@/lib/habitUtils";
import { todayISO } from "@/lib/dateUtils";
import { useHydrated } from "@/hooks/useHydrated";

type View = "today" | "calendar";

export function HabitList() {
  const { data, deleteHabit, toggleHabitOnDate } = useData();
  const hydrated = useHydrated();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [view, setView] = useState<View>("today");
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (activeHabitId !== null && !data.habits.some((h) => h.id === activeHabitId)) {
      setActiveHabitId(data.habits.length > 0 ? data.habits[0].id : null);
      return;
    }
    if (activeHabitId === null && data.habits.length > 0) {
      setActiveHabitId(data.habits[0].id);
    }
  }, [hydrated, data.habits, activeHabitId]);

  const handleEdit = (habit: Habit) => {
    setEditing(habit);
    setFormOpen(true);
  };

  const today = todayISO();

  const activeHabits = useMemo(
    () => data.habits.filter((h) => !h.isArchived),
    [data.habits],
  );

  const archivedHabits = useMemo(
    () => data.habits.filter((h) => h.isArchived),
    [data.habits],
  );

  const todayHabits = useMemo(
    () =>
      activeHabits
        .filter((h) => isHabitScheduledOn(h, today))
        .sort((a, b) => a.title.localeCompare(b.title)),
    [activeHabits, today],
  );

  const completedToday = todayHabits.filter((h) => isHabitCompletedOn(h, today)).length;

  if (activeHabits.length === 0 && view === "today" && archivedHabits.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl italic">Daily Habits</h2>
          <Button onClick={() => setFormOpen(true)} size="sm" variant="primary">
            <Plus className="h-3.5 w-3.5" />
            New Habit
          </Button>
        </div>
        <Card>
          <div className="py-10 text-center">
            <p className="font-serif text-base italic text-[var(--fg-soft)]">
              Begin where you stand.
            </p>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              Create your first habit — small, daily, consistent.
            </p>
            <Button onClick={() => setFormOpen(true)} size="sm" variant="primary" className="mt-4">
              <Plus className="h-3.5 w-3.5" />
              Create Habit
            </Button>
          </div>
        </Card>
        <HabitForm open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} initial={editing ?? undefined} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h2 className="font-serif text-xl italic">
            {view === "today" ? "Daily Habits" : "Calendar"}
          </h2>
          <p className="text-xs text-[var(--fg-soft)] mt-0.5">
            {view === "today"
              ? `${completedToday} of ${todayHabits.length} complete today`
              : "A month at a glance."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border p-0.5" style={{ borderColor: "var(--border-soft)" }}>
            <button
              onClick={() => setView("today")}
              className={`px-3 h-8 text-xs font-medium rounded ${view === "today" ? "bg-[var(--accent)] text-cream-50" : "text-[var(--fg-soft)]"}`}
            >
              Today
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`px-3 h-8 text-xs font-medium rounded ${view === "calendar" ? "bg-[var(--accent)] text-cream-50" : "text-[var(--fg-soft)]"}`}
            >
              Calendar
            </button>
          </div>
          <Button onClick={() => setFormOpen(true)} size="sm" variant="primary">
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
        </div>
      </div>

      {view === "today" ? (
        <div className="space-y-2">
          {todayHabits.length === 0 ? (
            <Card>
              <p className="text-center text-sm text-[var(--fg-soft)] font-serif italic py-4">
                No habits scheduled for today.
              </p>
            </Card>
          ) : (
            todayHabits.map((h) => (
              <HabitItem
                key={h.id}
                habit={h}
                date={today}
                onToggle={toggleHabitOnDate}
                onEdit={handleEdit}
                onDelete={deleteHabit}
              />
            ))
          )}

          {archivedHabits.length > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setShowArchived((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-[var(--fg-muted)] hover:text-[var(--fg-soft)] transition-colors group"
              >
                <ArchiveRestore className="h-3.5 w-3.5 group-hover:text-[var(--accent)] transition-colors" />
                {showArchived ? "Hide" : "Show"} {archivedHabits.length} archived habit{archivedHabits.length !== 1 ? "s" : ""}
              </button>

              {showArchived && (
                <div className="mt-2 space-y-2 animate-[fade-in_0.2s_ease-out]">
                  {archivedHabits.map((h) => (
                    <HabitItem
                      key={h.id}
                      habit={h}
                      date={today}
                      onToggle={toggleHabitOnDate}
                      onEdit={handleEdit}
                      onDelete={deleteHabit}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <Card padded={false}>
          <div className="p-5 border-b" style={{ borderColor: "var(--border-soft)" }}>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCalendarMonth((m) => subMonths(m, 1))}
                className="p-1.5 rounded hover:bg-cream-200 dark:hover:bg-ink-400"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="font-serif text-lg italic">{format(calendarMonth, "MMMM yyyy")}</div>
              <button
                onClick={() => setCalendarMonth((m) => addMonths(m, 1))}
                className="p-1.5 rounded hover:bg-cream-200 dark:hover:bg-ink-400"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="px-5 pt-4">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {activeHabits.map((h) => {
                const { current, best } = computeStreak(h);
                return (
                  <button
                    key={h.id}
                    onClick={() => setActiveHabitId(h.id === activeHabitId ? null : h.id)}
                    className={`px-2.5 h-7 text-[11px] rounded-full border transition-colors ${
                      h.id === activeHabitId
                        ? "bg-[var(--accent)] text-cream-50 border-[var(--accent)]"
                        : "border-[var(--border-soft)] hover:bg-cream-200 dark:hover:bg-ink-400 text-[var(--fg-soft)]"
                    }`}
                  >
                    {h.title} · {current}
                    {best > 0 && <span className="ml-1 opacity-60">/ {best}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-5 pb-5">
            <HabitCalendar
              habits={activeHabitId ? activeHabits.filter((h) => h.id === activeHabitId) : activeHabits}
              month={calendarMonth}
            />
          </div>
        </Card>
      )}

      <HabitForm open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} initial={editing ?? undefined} />
    </div>
  );
}
