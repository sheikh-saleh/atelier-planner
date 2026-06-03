# Atelier — Daily Routine Planner

A fully responsive, classical-aesthetic webapp for daily planning, habit tracking, Pomodoro focus, and journaling. All data is stored locally in the browser.

## Features

- **Today dashboard** — greeting, today's progress, time-slot tasks, habits, quick journal
- **Daily tasks** — morning / afternoon / evening slots, categories, durations
- **Habit tracker** — daily / weekdays / weekends / custom frequency, streaks, calendar view, 49-day heatmap
- **Pomodoro** — customizable focus / short / long breaks, cycle counter, sound + notifications
- **Journal** — mood + free-form notes, date navigation, auto-save
- **Insights** — weekly chart, habit heatmap, streak leaderboard, today's rings
- **Settings** — theme, notifications, sound, data export / import / reset
- **Responsive** — desktop sidebar, mobile bottom-nav, touch-friendly targets
- **Light + dark** — classical palettes with serif typography

## Tech

- **Next.js 14** (App Router) + **TypeScript**
- **TailwindCSS** with custom classical theme
- **Recharts** for charts
- **Lucide** icons
- **date-fns** for dates
- **localStorage** for persistence

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Build

```bash
npm run build
npm start
```

## Project Structure

```
app/                # routes (pages)
components/
  layout/           # AppShell, Sidebar, MobileNav, Header
  providers/        # DataProvider, ThemeProvider
  tasks/            # TaskList, TaskItem, TaskForm
  habits/           # HabitList, HabitItem, HabitForm, HabitCalendar
  timer/            # PomodoroTimer, PomodoroSettings
  journal/          # JournalEditor, JournalView
  stats/            # WeeklyChart, HabitHeatmap, StreakLeaderboard, TodayProgress
  settings/         # SettingsPanel
  ui/               # Card, Button, Input, Modal, ProgressRing, ThemeToggle
hooks/              # useLocalStorage
lib/                # types, utils, dateUtils, habitUtils, storage, notifications
```

## Design Notes

- Typography pairs **Playfair Display** (italic headings) with **Inter** (body) and **Cormorant Garamond** (timer numerals)
- Light palette: cream, ink, sage, dusty blue, gold accent
- Dark palette: deep charcoal, parchment, desaturated accents
- Subtle paper texture, hairline gold dividers, ornamental section markers
- All interactions have soft, classical transitions — never bouncy
