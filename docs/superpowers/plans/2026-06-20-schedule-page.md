# Schedule Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Schedule page with a monthly calendar view showing all tasks across dates, with a side panel for day details.

**Architecture:** Custom CSS grid calendar component + slide-over day panel, reusing existing `TaskList` and `TaskForm` components. No new data models or API routes.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, date-fns, Lucide icons

---

## File Structure

| File | Action | Purpose |
|------|--------|---------|
| `components/schedule/CalendarGrid.tsx` | Create | Monthly calendar grid with task dots |
| `components/schedule/DayPanel.tsx` | Create | Slide-over panel showing day's tasks |
| `app/(app)/app/schedule/page.tsx` | Create | Schedule page component |
| `components/layout/Sidebar.tsx` | Edit | Add Schedule nav item |
| `components/layout/MobileNav.tsx` | Edit | Add Schedule nav item |

---

### Task 1: Create CalendarGrid Component

**Files:**
- Create: `components/schedule/CalendarGrid.tsx`

- [ ] **Step 1: Create the CalendarGrid component**

```tsx
"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { categoryMap } from "@/lib/utils";
import type { Task } from "@/lib/types";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  parseISO,
} from "date-fns";

interface CalendarGridProps {
  year: number;
  month: number; // 0-indexed
  tasks: Task[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const categoryDots: Record<string, string> = {
  work: "bg-blue-dusty-300",
  personal: "bg-sage-300",
  health: "bg-burgundy-300",
  leisure: "bg-gold-300",
  errand: "bg-ink-300",
};

export function CalendarGrid({
  year,
  month,
  tasks,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) {
  const monthDate = new Date(year, month, 1);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(monthDate));
    const end = endOfWeek(endOfMonth(monthDate));
    return eachDayOfInterval({ start, end });
  }, [year, month]);

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (!map[task.date]) map[task.date] = [];
      map[task.date].push(task);
    }
    return map;
  }, [tasks]);

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={onPrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-serif text-lg italic" style={{ color: "var(--fg)" }}>
          {format(monthDate, "MMMM yyyy")}
        </h2>
        <Button variant="ghost" size="sm" onClick={onNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center font-serif text-[10px] uppercase tracking-[0.2em] text-[var(--fg-muted)] py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px" style={{ background: "var(--border-soft)" }}>
        {days.map((day) => {
          const iso = format(day, "yyyy-MM-dd");
          const dayTasks = tasksByDate[iso] ?? [];
          const inMonth = isSameMonth(day, monthDate);
          const today = isToday(day);
          const selected = iso === selectedDate;

          return (
            <button
              key={iso}
              onClick={() => onSelectDate(iso)}
              className={cn(
                "relative flex flex-col items-center py-2 min-h-[4rem] transition-colors",
                inMonth ? "bg-[var(--bg-card)]" : "bg-[var(--bg-card)]/50",
                today && !selected && "ring-1 ring-[var(--accent)] ring-inset",
                selected && "bg-[var(--accent)]/10",
                "hover:bg-[var(--accent)]/5",
              )}
            >
              <span
                className={cn(
                  "text-sm font-serif",
                  !inMonth && "text-[var(--fg-muted)] opacity-40",
                  inMonth && !today && "text-[var(--fg)]",
                  today && "font-bold text-[var(--accent)]",
                )}
              >
                {format(day, "d")}
              </span>

              {/* Task dots */}
              {dayTasks.length > 0 && (
                <div className="flex items-center gap-0.5 mt-1 flex-wrap justify-center max-w-[3rem]">
                  {dayTasks.slice(0, 3).map((task) => (
                    <span
                      key={task.id}
                      className={cn("w-1.5 h-1.5 rounded-full", categoryDots[task.category])}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="text-[8px] text-[var(--fg-muted)] leading-none">
                      +{dayTasks.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the component compiles**

Run: `npx tsc --noEmit --pretty`
Expected: No errors related to `CalendarGrid.tsx`

- [ ] **Step 3: Commit**

```bash
git add components/schedule/CalendarGrid.tsx
git commit -m "feat(schedule): add CalendarGrid component"
```

---

### Task 2: Create DayPanel Component

**Files:**
- Create: `components/schedule/DayPanel.tsx`

- [ ] **Step 1: Create the DayPanel component**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskList } from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";

interface DayPanelProps {
  date: string | null;
  onClose: () => void;
}

export function DayPanel({ date, onClose }: DayPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (date) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [date, onClose]);

  return (
    <AnimatePresence>
      {date && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed top-0 right-0 z-50 h-full overflow-y-auto",
              "w-full bg-[var(--bg-card)] border-l shadow-xl",
              "lg:w-96 lg:shadow-2xl",
            )}
            style={{ borderColor: "var(--border-soft)" }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-[var(--bg-card)]/95 backdrop-blur" style={{ borderColor: "var(--border-soft)" }}>
              <h3 className="font-serif text-lg italic" style={{ color: "var(--fg)" }}>
                {formatDate(date, "EEEE, MMMM d")}
              </h3>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tasks for this day */}
            <div className="p-4">
              <TaskList date={date} showAdd={true} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify the component compiles**

Run: `npx tsc --noEmit --pretty`
Expected: No errors related to `DayPanel.tsx`

- [ ] **Step 3: Commit**

```bash
git add components/schedule/DayPanel.tsx
git commit -m "feat(schedule): add DayPanel slide-over component"
```

---

### Task 3: Create Schedule Page

**Files:**
- Create: `app/(app)/app/schedule/page.tsx`

- [ ] **Step 1: Create the Schedule page**

```tsx
"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { CalendarGrid } from "@/components/schedule/CalendarGrid";
import { DayPanel } from "@/components/schedule/DayPanel";
import { Card } from "@/components/ui/Card";
import { AnimatedPage } from "@/components/motion";
import { useData } from "@/components/providers/DataProvider";
import { useHydrated } from "@/hooks/useHydrated";

export default function SchedulePage() {
  const hydrated = useHydrated();
  const { data } = useData();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  if (!hydrated) {
    return (
      <AnimatedPage>
        <div className="space-y-4">
          <Header title="Schedule" showDate={false} />
          <div className="h-96 rounded-xl bg-cream-200 dark:bg-ink-400 animate-pulse" />
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-6 sm:space-y-8">
        <Header
          title="Schedule"
          subtitle="Plan your days ahead."
          showDate={false}
        />

        <Card padded={false}>
          <div className="p-5 sm:p-6">
            <CalendarGrid
              year={year}
              month={month}
              tasks={data.tasks}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
          </div>
        </Card>

        <DayPanel date={selectedDate} onClose={() => setSelectedDate(null)} />
      </div>
    </AnimatedPage>
  );
}
```

- [ ] **Step 2: Verify the page compiles**

Run: `npx tsc --noEmit --pretty`
Expected: No errors related to `schedule/page.tsx`

- [ ] **Step 3: Verify the page loads in browser**

Run: `npm run dev`
Expected: Navigate to `/app/schedule`, calendar renders with current month, task dots visible

- [ ] **Step 4: Commit**

```bash
git add "app/(app)/app/schedule/page.tsx"
git commit -m "feat(schedule): add Schedule page with calendar view"
```

---

### Task 4: Update Navigation

**Files:**
- Modify: `components/layout/Sidebar.tsx:5` (import line)
- Modify: `components/layout/Sidebar.tsx:10-18` (items array)
- Modify: `components/layout/MobileNav.tsx:5` (import line)
- Modify: `components/layout/MobileNav.tsx:9-15` (items array)

- [ ] **Step 1: Update Sidebar - add Calendar import and nav item**

In `components/layout/Sidebar.tsx`, change the import on line 5:

```tsx
import { Calendar, CheckSquare, Home, LineChart, PenLine, Settings as SettingsIcon, Timer, User, Lightbulb } from "lucide-react";
```

Then add the Schedule item to the `items` array (after Today):

```tsx
const items = [
  { href: "/app", label: "Today", icon: Home },
  { href: "/app/schedule", label: "Schedule", icon: Calendar },
  { href: "/app/habits", label: "Habits", icon: CheckSquare },
  { href: "/app/timer", label: "Pomodoro", icon: Timer },
  { href: "/app/projects", label: "Projects", icon: Lightbulb },
  { href: "/app/journal", label: "Journal", icon: PenLine },
  { href: "/app/stats", label: "Insights", icon: LineChart },
  { href: "/app/settings", label: "Settings", icon: SettingsIcon },
];
```

- [ ] **Step 2: Update MobileNav - add Calendar import and nav item**

In `components/layout/MobileNav.tsx`, change the import on line 5:

```tsx
import { Calendar, CheckSquare, Home, LineChart, Lightbulb, PenLine, Settings as SettingsIcon, Timer } from "lucide-react";
```

Then add Schedule to the `items` array:

```tsx
const items = [
  { href: "/app", label: "Today", icon: Home },
  { href: "/app/schedule", label: "Schedule", icon: Calendar },
  { href: "/app/projects", label: "Projects", icon: Lightbulb },
  { href: "/app/habits", label: "Habits", icon: CheckSquare },
  { href: "/app/timer", label: "Focus", icon: Timer },
  { href: "/app/settings", label: "More", icon: SettingsIcon },
];
```

- [ ] **Step 3: Verify navigation compiles**

Run: `npx tsc --noEmit --pretty`
Expected: No errors

- [ ] **Step 4: Verify navigation renders correctly**

Run: `npm run dev`
Expected: Schedule link visible in sidebar (desktop) and mobile nav (6 items)

- [ ] **Step 5: Commit**

```bash
git add components/layout/Sidebar.tsx components/layout/MobileNav.tsx
git commit -m "feat(schedule): add Schedule to sidebar and mobile navigation"
```

---

### Task 5: Final Verification

- [ ] **Step 1: Run full type check**

Run: `npx tsc --noEmit --pretty`
Expected: No errors

- [ ] **Step 2: Run dev server and test all flows**

Run: `npm run dev`

Manual verification:
1. Navigate to `/app/schedule` - calendar renders with current month
2. Click prev/next arrows - month changes correctly
3. Click a day with tasks - side panel opens with tasks grouped by time-of-day
4. Click a day without tasks - side panel opens empty
5. Click backdrop or X - panel closes
6. Press Escape - panel closes
7. Click "New Task" in panel - task form opens with selected date
8. Add a task - dot appears on that day in calendar
9. Navigate to `/app` - Today dashboard unchanged, still shows only today's tasks
10. Check sidebar - Schedule link visible and active
11. Check mobile nav - 6 items visible, Schedule works

- [ ] **Step 3: Commit any final fixes**

```bash
git add -A
git commit -m "fix(schedule): minor adjustments from final verification"
```
