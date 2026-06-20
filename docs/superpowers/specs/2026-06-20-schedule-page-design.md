# Schedule Page Design

## Overview

Add a dedicated Schedule page (`/app/schedule`) that shows a monthly calendar view of all tasks across all dates. The Today dashboard (`/app`) remains unchanged and continues to show only today's tasks.

## Goals

- View all scheduled tasks across future (and past) dates
- Navigate month-by-month via a custom calendar grid
- Click a day to see its tasks in a side panel
- Add new tasks from the Schedule page

## Non-Goals

- No new data models or API routes
- No changes to the existing Today dashboard
- No external calendar library dependencies

---

## Component Architecture

### 1. Schedule Page (`app/(app)/app/schedule/page.tsx`)

Top-level page component. Manages:
- Current month/year state (for calendar navigation)
- Selected date state (for side panel)
- Passes `data.tasks` from `useData()` to child components

Layout:
```
Header ("Schedule" + subtitle)
CalendarGrid
DayPanel (conditional)
Floating add button
```

### 2. CalendarGrid (`components/schedule/CalendarGrid.tsx`)

Custom monthly calendar grid built with CSS grid.

**Props:**
```ts
interface CalendarGridProps {
  year: number;
  month: number; // 0-indexed
  tasks: Task[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}
```

**Rendering:**
- 7-column grid for Sun-Sat
- Header row with day abbreviations
- 5-6 rows for month days
- Each cell shows:
  - Day number (dimmed if outside current month)
  - Up to 3 colored dots (by category: work=blue, personal=purple, health=green, leisure=amber, errand=red)
  - "+N" indicator if >3 tasks
  - Today: ring/badge highlight
  - Selected: filled background
- Navigation: `[←] Month Year [→]` header with prev/next buttons

### 3. DayPanel (`components/schedule/DayPanel.tsx`)

Slide-over panel showing a day's tasks.

**Props:**
```ts
interface DayPanelProps {
  date: string;
  onClose: () => void;
}
```

**Rendering:**
- Reuses `TaskList` component with the selected date
- Same time-of-day grouping (Morning/Afternoon/Evening/Anytime)
- "Add Task" button opens `TaskForm` with date pre-filled
- Slides in from right, `w-96` on desktop, full-width on mobile
- Backdrop overlay, click to close

### 4. Navigation Updates

**Sidebar (`components/layout/Sidebar.tsx`):**
- Add `{ href: "/app/schedule", label: "Schedule", icon: Calendar }` after "Today"

**MobileNav (`components/layout/MobileNav.tsx`):**
- Add Schedule as 6th item: `{ href: "/app/schedule", label: "Schedule", icon: Calendar }`
- All existing items remain

---

## Data Flow

```
useData().tasks
    │
    ▼
SchedulePage
    │
    ├──► CalendarGrid (all tasks, renders dots per day)
    │
    └──► DayPanel (filtered to selectedDate)
             │
             └──► TaskList (existing component, date prop)
```

No new state management needed. Uses existing `DataProvider` context.

---

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `app/(app)/app/schedule/page.tsx` | Create | Schedule page component |
| `components/schedule/CalendarGrid.tsx` | Create | Monthly calendar grid |
| `components/schedule/DayPanel.tsx` | Create | Day detail slide-over |
| `components/layout/Sidebar.tsx` | Edit | Add Schedule nav item |
| `components/layout/MobileNav.tsx` | Edit | Add Schedule nav item |

## Styling

- Uses existing Atelier design tokens (CSS variables)
- Calendar grid: CSS grid with `gap: 1px` or `gap: 0.5`
- Dots: `w-1.5 h-1.5 rounded-full` with category-specific colors
- Panel: Fixed positioning with backdrop, framer-motion for slide animation
- Responsive: Panel full-width on mobile, `w-96` on desktop

## Testing

- Verify calendar renders correctly for current month
- Verify prev/next month navigation works
- Verify task dots appear on correct days
- Verify clicking a day opens the panel with correct tasks
- Verify adding a task from the panel works
- Verify Today dashboard still works unchanged
- Verify mobile nav has 6 items and is usable
