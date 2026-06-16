# Atelier — A Comprehensive Analysis of a Daily Routine Planner Worth Keeping

**Author:** Code Architecture Review  
**Date:** June 2026  
**Version:** 1.0.0  
**Repository:** Daily Routine Planner (Next.js 14)

---

# Part I: Foundations

## 1. Executive Summary

Atelier is not just another productivity app. It is a deliberately crafted, classical-aesthetic daily routine planner that rejects the gamification, notification overload, and feature bloat that define modern productivity software. Built as a Progressive Web App (PWA) using Next.js 14 and TypeScript, Atelier lives in the browser, works offline, and stores data locally by default — with optional cloud sync via Supabase.

The application serves a single purpose: helping users plan and reflect on a single day at a time through four interconnected tools — time-blocked tasks, habit tracking, Pomodoro focus sessions, and mood journaling. A fifth feature, the Project Planner, uses AI (via Ollama or OpenAI) to generate structured project briefs from rough ideas, making Atelier useful not just for daily routines but for software ideation and planning.

This article provides a thorough walkthrough of Atelier's architecture, design philosophy, component hierarchy, data model, routing strategy, state management, theming system, utility layer, offline capabilities, and deployment infrastructure. Every page, every component, and every utility function is examined in depth.

---

## 2. Philosophy and Design Ethos

Atelier is built on a clear philosophical foundation that distinguishes it from conventional productivity applications:

**"Discipline, repeated."** — The tagline embodies the core belief that consistency matters more than intensity. The app is designed to be used daily, quietly, without fanfare or pressure. The homepage hero makes this explicit: the headline reads "Discipline, repeated." with the word "repeated" highlighted in the accent gold color. This is not a tool for sprinting toward arbitrary goals — it is a tool for showing up, day after day, and doing the small work that compounds into a well-lived life.

**"A small set of tools, used well."** — Rather than offering an exhaustive suite of features, Atelier focuses on four essential daily practices: tasks, habits, focus time, and journaling. Each tool is intentionally minimal. The feature grid on the landing page advertises exactly six capabilities, each described in a single sentence. The app's subtitle on every page reinforces this: "A small daily practice, repeated faithfully."

**"Quiet by design."** — There are no badges, no aggressive notifications, no leaderboards screaming for attention. The visual design is subdued, using cream paper aesthetics, serif typography, and gold accents to evoke a sense of calm permanence. The Insights page subtitle reads "What gets measured gets tended" — not "crush your goals" or "beat your streaks." The Pomodoro page says "Twenty-five minutes, deeply. Then rest." The ethos is restorative, not extractive.

**"Local-first, privacy-first."** — Data lives in the browser by default. Cloud sync is opt-in, not assumed. The app works fully offline. No data is ever sold or shared. The about page lists this as one of three core values. The pricing page emphasizes: "Your data stays in your browser, not on our servers." The FAQ answers "Where is my data stored?" with a detailed, honest explanation: local storage by default, encrypted Supabase database if you sign in, and never shared or sold.

**"Open source."** — The entire codebase is open and auditable. There is no vendor lock-in. Users can inspect, modify, and self-host if desired. The about page calls this out directly: "The code is yours to read, audit, and learn from. No vendor lock-in, ever."

**"Free forever."** — The free tier includes every core feature with no time limit and no account required. Pro is a one-time $19 payment for cloud sync and future features — no subscriptions, no recurring charges, no "Pro" paywalls on basic functionality. This is explicitly modeled on the belief that productivity tools should not profit from user dependence.

These philosophical choices manifest in concrete technical decisions throughout the codebase, from the storage architecture to the animation system to the color palette. Every React component, every CSS variable, every route guard reflects a deliberate choice about what kind of relationship the software should have with its users.

---

## 3. Technology Stack Rationale

Atelier's tech stack is modern, lightweight, and carefully chosen. Each technology decision has a clear rationale aligned with the project's philosophy:

### Framework: Next.js 14 (App Router)
The App Router provides server components, nested layouts, and route groups — all essential for separating the marketing site from the authenticated application. The `(marketing)` and `(app)` route groups allow different layouts and shells for public vs. private pages without URL path complexity. Next.js also provides built-in font optimization, image optimization, and metadata API for SEO.

### Language: TypeScript 5.5
Every file in the project is TypeScript. The type system defines the entire data model (`types.ts`), supports discriminated unions for complex state (`JournalMoodUpdate`), and provides autocompletion across the component tree. The `cn()` utility wraps `clsx` for type-safe class name composition.

### UI: Tailwind CSS 3.4
Tailwind is configured with an extended color palette that goes beyond utility classes. The custom theme defines cream (#FAF7F0), ink (#2C2A26), sage (#8CB08C), dusty blue (#7B9DBF), gold (#B8860B), and burgundy (#9E4A5C) as first-class colors. All spacing, typography, and animation tokens are consistent with the classical aesthetic.

### Backend: Supabase
Supabase provides authentication, database, and real-time capabilities in a single platform. The `supabase-schema.sql` defines six tables with row-level security. The `@supabase/supabase-js` client is used on both client and server (via Server Actions). The anonymous key pattern allows public access with per-user data isolation through RLS policies.

### AI Integration: Vercel AI SDK + Ollama
The project planner uses `@ai-sdk/openai` which is actually a generic OpenAI-compatible client — configured to point at an Ollama instance by default. This means the AI brief generation can run entirely locally using models like Gemma 3 12B, or be swapped to OpenAI by changing environment variables. The `generateText()` function with provider options gives fine control over token limits and temperature.

### Charts: Recharts
Recharts is a composable charting library that integrates naturally with React. The `WeeklyChart` component uses `BarChart`, `Bar`, `XAxis`, `YAxis`, `CartesianGrid`, and `Tooltip` — all customized with CSS variable references for theme compatibility. The stacked bar design (completed vs. missed tasks) is both informative and aesthetically aligned with the app's quiet design language.

### Dates: date-fns
date-fns is chosen over Moment.js or Day.js for its tree-shakeable module structure. The `lib/dateUtils.ts` file imports only the functions used: `format`, `parseISO`, `isToday`, `isYesterday`, `startOfDay`, `addDays`, `differenceInCalendarDays`. The `getTimeOfDay()` function is a bespoke implementation that classifies times into morning/afternoon/evening/unscheduled — a domain-specific need that date-fns does not directly address.

### Icons: Lucide React
Lucide provides consistently designed, MIT-licensed SVG icons. The `HabitForm` dynamically imports icons from lucide-react using a type-safe pattern: `(Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)`. This allows users to select from 18 icon options stored as string names in the habit data model.

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 (App Router) | Server-side rendering, routing, API routes |
| Language | TypeScript 5.5 | Type safety across the entire codebase |
| UI Styling | Tailwind CSS 3.4 | Utility-first CSS with custom classical theme |
| Fonts | Playfair Display, Inter, Cormorant Garamond | Classical typography stack |
| Icons | Lucide React | Consistent, lightweight icon set |
| Charts | Recharts 2.12 | Weekly task completion charts |
| Dates | date-fns 3.6 | Date formatting and manipulation |
| Backend/Database | Supabase | Authentication, cloud sync, project briefs |
| AI Integration | Vercel AI SDK + Ollama/OpenAI | Project brief generation |
| Offline/PWA | Serwist | Service worker management |
| State Management | React Context + hooks | Local state with context providers |
| Persistence | localStorage (primary), Supabase (optional sync) | Data storage strategy |

The stack is notably minimal. There is no Redux, no Zustand, no complex state management library. The app uses React Context and hooks exclusively, reflecting the principle that simpler tools produce better outcomes.

Tailwind CSS is configured with a custom theme that extends the default palette with classical colors: cream, ink, sage, dusty blue, gold, and burgundy. These colors are available as both Tailwind utilities (e.g., `bg-cream-50`, `text-ink-500`) and CSS custom properties for non-Tailwind contexts like Recharts and inline styles.

The font stack is particularly deliberate. Playfair Display (italic only for headings) provides the classical serif headline presence. Inter handles all body text with clean readability. Cormorant Garamond, a delicate serif, is reserved for the Pomodoro timer numerals where the visual weight of each digit matters. All three are loaded via Next.js's built-in font optimization with `display: swap` for performance.

---

# Part II: Architecture

## 4. Project Structure and Routing Architecture

Atelier uses Next.js 14's App Router with two distinct route groups that separate marketing content from the core application:

### Route Groups

```
app/
├── (marketing)/          # Public marketing pages
│   ├── page.tsx          # Landing page (/)
│   ├── layout.tsx        # Marketing layout (nav, footer)
│   ├── about/page.tsx    # About page
│   ├── pricing/page.tsx  # Pricing page
│   └── components/       # Marketing-specific components
├── (app)/                # Authenticated application
│   └── app/              # App sub-route
│       ├── page.tsx      # Today dashboard (/app)
│       ├── habits/page.tsx
│       ├── timer/page.tsx
│       ├── projects/page.tsx
│       ├── journal/page.tsx
│       ├── stats/page.tsx
│       └── settings/page.tsx
├── auth/page.tsx         # Authentication page
├── layout.tsx            # Root layout (fonts, providers)
└── globals.css           # Global styles, CSS variables
```

### Route Guard

The `RequireAuth` component (`components/auth/RequireAuth.tsx`) handles routing logic:

- **Public paths** (`/`, `/pricing`, `/about`, `/auth`) are accessible without authentication
- **App paths** (`/app/*`) require authentication; unauthenticated users are redirected to `/auth`
- **Authenticated users** visiting `/` are redirected to `/app`
- The guard uses `useAuth()` and `usePathname()` from Next.js to determine access

### Layout Hierarchy

```
RootLayout (fonts, providers)
  ├── AuthProvider (Supabase session management)
  │   └── DataProvider (app data context)
  │       └── ThemeProvider (light/dark/sepia)
  │           └── RequireAuth (route guard)
  │               ├── [Public marketing pages — no shell]
  │               └── [Authenticated app pages — wrapped in AppShell]
  │                   ├── Sidebar (desktop)
  │                   ├── Main content area
  │                   └── MobileNav (mobile bottom nav)
```

This layered architecture ensures clean separation of concerns: authentication is handled at the highest level, data flows through context providers, and UI layout is determined by the authentication status and route.

---

## 5. Data Model and Type System

Atelier's data model is defined in `lib/types.ts` with seven core types:

### Task
```typescript
interface Task {
  id: string;              // UUID generated by uid()
  title: string;           // Required task name
  description?: string;    // Optional detailed notes
  date: string;            // ISO yyyy-MM-dd
  time?: string;           // Optional HH:mm time slot
  durationMin?: number;    // Optional duration in minutes
  category: Category;      // "work" | "personal" | "health" | "leisure" | "errand"
  completed: boolean;      // Completion status
  createdAt: number;       // Unix timestamp
  priority?: "low" | "medium" | "high";
}
```

Tasks are designed for time-blocked daily planning. Each task belongs to a specific date, can be scheduled to a time slot, categorized, and prioritized. The `getTimeOfDay()` utility auto-classifies tasks into morning (before 12:00), afternoon (12:00-17:00), or evening (after 17:00) slots.

### Habit
```typescript
interface Habit {
  id: string;
  title: string;
  description?: string;
  icon: string;            // Lucide icon name
  color: string;           // Color key for theming
  frequency: Frequency;    // "daily" | "weekdays" | "weekends" | "custom"
  customDays?: number[];   // 0=Sun..6=Sat for custom frequency
  completedDates: string[]; // All dates when habit was completed
  createdAt: number;
  isArchived?: boolean;
  notes?: string;          // Optional motivation note
}
```

Habits track completion over time via an array of ISO dates. The frequency system supports daily, weekday-only, weekend-only, and custom day-of-week selection. The `isArchived` flag allows retiring habits without losing history.

### Journal Entry
```typescript
interface JournalEntry {
  date: string;            // ISO date
  content: string;         // Free-form text
  mood?: 1 | 2 | 3 | 4 | 5; // Mood rating (1=worst, 5=best)
  updatedAt: number;       // Last modification timestamp
}
```

Journal entries are keyed by date in a `Record<string, JournalEntry>` map. The mood field is a simple 1-5 scale. The `JournalMoodUpdate` type supports three operations: setting a mood, clearing it, or leaving it unchanged.

### Pomodoro Session
```typescript
interface PomodoroSession {
  id: string;
  date: string;            // ISO date
  type: PomodoroType;      // "focus" | "short" | "long"
  durationMin: number;     // Actual duration in minutes
  completed: boolean;      // Whether session was completed
  startedAt: number;       // Unix timestamp
}
```

Each completed Pomodoro session is logged for tracking focus time over time. Sessions have a type (focus, short break, long break) and duration.

### Settings
```typescript
interface Settings {
  theme: "light" | "dark" | "sepia";
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  pomodoro: PomodoroConfig; // Focus/break durations, cycles until long break
  soundType?: "chime" | "bell" | "digital" | "gong";
}
```

Settings control the entire user experience — visual theme, notification behavior, sound preferences, and Pomodoro configuration. The `soundType` field allows selecting different notification tones, each synthesized via the Web Audio API.

### AppData (Root Data Structure)
```typescript
interface AppData {
  tasks: Task[];
  habits: Habit[];
  journal: Record<string, JournalEntry>;
  pomodoros: PomodoroSession[];
  settings: Settings;
}
```

This single root object is stored in localStorage under the key `atelier-planner-v1`. It is loaded and saved atomically. The entire application state fits in a single JSON object — simple, predictable, and easy to back up.

### ProjectBrief (Supplementary)
```typescript
interface ProjectBrief {
  id: string;
  userId: string;
  idea: string;              // Original idea text
  content: ProjectBriefContent; // Structured sections
  createdAt: string;
  updatedAt: string;
}
```

The ProjectBrief is a separate entity used by the Projects feature. It stores AI-generated structured project plans and is persisted both locally and optionally in Supabase.

### Data Flow Patterns

Data flows through the application in a unidirectional pattern:

```
User Action → DataProvider method → setData() → React re-render → saveData() (localStorage)
                                                         ↕ (if authenticated)
                                                    sync() (Supabase)
```

Each mutation flows through a single `setData()` call on the root state, ensuring predictability. The `useCallback` wrappers around every method prevent unnecessary re-renders when passed as deps to child components.

The journal system has a particularly interesting data flow nuance. The `JournalMoodUpdate` discriminated union type supports three operations on mood state:

```typescript
export type JournalMoodUpdate = JournalEntry["mood"] | "clear";
```

- `undefined`: No change to existing mood
- `"clear"`: Remove the mood entirely
- `1 | 2 | 3 | 4 | 5`: Set a specific mood value

This design avoids a common React pitfall where clearing an input value and leaving it unchanged are conflated. The `setJournal` method in DataProvider handles all three cases through a single `if/else` chain:

```typescript
const nextMood: JournalEntry["mood"] | undefined =
  mood === "clear" ? undefined
  : mood === undefined ? prev?.mood
  : mood;
```

---

## 6. State Management Architecture

Atelier's state management is refreshingly simple: React Context with `useState` and `useCallback`, without any external state management library.

### Hydration Pattern

A critical architectural pattern in Atelier is hydration-safe rendering. Because the app relies on localStorage (a client-only API), the server-rendered HTML must not attempt to read or render data. Two mechanisms handle this:

**1. The `useHydrated` hook** (`hooks/useHydrated.ts`):
```typescript
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
```
This hook starts as `false` and flips to `true` after the first client-side render. Components use it to conditionally render data-dependent content. The Today Dashboard, for example, shows skeleton loading animations before hydration completes.

**2. The `suppressHydrationWarning` attribute** is used on the root `<html>` element and on date displays to prevent React hydration mismatch errors. The theme injection script in `<head>` ensures the correct theme class is applied before the first paint, preventing flash of unstyled content.

This dual approach — `suppressHydrationWarning` in layout and `useHydrated` in components — ensures the app works correctly with Next.js's server-side rendering while being a fundamentally client-side application.

### DataProvider (`components/providers/DataProvider.tsx`)

The `DataProvider` is the central state management hub. It provides:

**State:**
- `data: AppData` — The complete application data
- `hydrated: boolean` — Whether localStorage has been loaded
- `syncing: boolean` — Whether Supabase sync is in progress

**Operations (all wrapped in `useCallback`):**
- **Tasks:** `addTask()`, `updateTask()`, `deleteTask()`, `toggleTask()`
- **Habits:** `addHabit()`, `updateHabit()`, `deleteHabit()`, `toggleHabitOnDate()`
- **Journal:** `setJournal()` (sets content and optional mood update)
- **Pomodoro:** `logPomodoro()` (appends a completed session)
- **Settings:** `setSettings()`, `setPomodoroConfig()`
- **Utility:** `resetAll()` (wipes all data back to defaults)

**Lifecycle Hooks:**
1. On mount: loads data from localStorage (or seed data if the `?seed` query flag is present)
2. On every state change: persists to localStorage via `saveData()`
3. On user login: pulls remote data from Supabase and merges it with local state
4. On user logout: resets the pull flag

**Sync Pattern:**
The provider uses a fire-and-forget pattern for Supabase sync. Every mutation calls a sync function that runs in the background, never blocking the UI. The sync layer (`lib/sync.ts`) handles CRUD operations for each entity type, using Supabase's authenticated client.

### ThemeProvider (`components/providers/ThemeProvider.tsx`)

The ThemeProvider manages the three-theme system (light, dark, sepia). It:
- Reads the current theme from `data.settings.theme`
- Syncs the `dark`/`sepia` CSS class on `<html>` element
- Provides `toggleTheme()` which cycles through light → dark → sepia → light
- Exposes a `mounted` flag to prevent hydration mismatches

### AuthProvider (`components/providers/AuthProvider.tsx`)

The AuthProvider wraps Supabase authentication with a guest mode fallback:
- **Supabase Auth:** Uses `supabase.auth.getSession()` and `onAuthStateChange()` listener
- **Guest Mode:** Creates a synthetic `User` object with `id: "guest-user"` stored in localStorage under `atelier-guest-user`
- Supports sign in, sign up, password reset, guest sign in, and sign out
- Includes a 5-second safety timeout to prevent infinite loading states

The guest mode is critical to Atelier's philosophy: users can start using the app immediately without creating an account.

### Security and Authentication Analysis

Atelier's authentication architecture merits examination from a security perspective:

**Guest Mode Security:**
The guest mode stores a synthetic user object in localStorage. This is not authenticated by any standard — it is purely cosmetic. The DataProvider detects guest mode via `userIdRef.current.startsWith("guest-")` and skips all Supabase sync operations. This means guest data never leaves the browser. The trade-off is that guest data is lost if localStorage is cleared or the browser is on a shared machine.

**Supabase Auth Flow:**
When authenticated, all Supabase operations use Row-Level Security (RLS) policies defined in `supabase-schema.sql`. The `authedClient()` function creates a new Supabase client with the user's access token in the Authorization header:

```typescript
function authedClient(accessToken: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } },
  );
}
```

This client is created per-request in Server Actions, ensuring each database operation carries the user's credentials. The Server Actions (`projects/actions.ts`) receive the access token from the client, pass it to `authedClient()`, and perform operations with proper user isolation.

**Password Security:**
The AuthForm enforces minimum password length (6 characters) on the client side, but relies on Supabase's server-side validation for production-grade password security. The password field has both `minLength` attribute and a JavaScript guard:

```typescript
if (password.length < 6) {
  setError("Password must be at least 6 characters");
  setLoading(false);
  return;
}
```

**Security Considerations:**
1. The 5-second safety timeout in AuthProvider prevents infinite loading but could mask actual auth failures
2. Guest mode does not provide any actual authentication — it is purely UX convenience
3. The access token is stored in React state (session), which is more secure than localStorage but lost on page refresh (requiring re-fetch via `getSession()`)
4. Supabase RLS policies are the primary data isolation mechanism and should be audited regularly

---

# Part III: The Marketing Site

## 7. Landing Page (`/`)

The landing page at `app/(marketing)/page.tsx` is a single-page marketing site with six sections:

### Hero Section
The Hero component (`app/(marketing)/components/Hero.tsx`) presents:
- A tagline badge: "New · PWA · Works offline"
- The main headline: "Discipline, repeated." with "repeated" highlighted in accent color
- Subtitle explaining the app's purpose
- Two CTAs: "Start free" (primary) and "Watch demo" (secondary)
- Trust signals: "Free forever", "No ads", "Privacy first"
- A PhoneFrame component showing a screenshot of the app inside a phone mockup

### Features Section
The FeatureGrid component displays six feature cards in a responsive grid:
1. **Time-blocked tasks** — Plan each day with time and duration
2. **Habit streaks** — Daily, weekdays, or custom frequency
3. **Pomodoro focus** — Configurable focus and break lengths
4. **Mood journal** — Short daily entry with one-tap mood
5. **Quiet insights** — Weekly and monthly charts
6. **Dark mode + PWA** — Install to home screen, works offline

Each feature card has a color-coded icon background (sage, burgundy, dusty blue, gold, ink) and includes hover animations with subtle shadow elevation.

### Screenshot Carousel
A carousel section showing app screenshots with the tagline "Quiet by design." The carousel uses the `ScreenshotCarousel` component which likely auto-rotates through screenshots of each app page.

### Demo Section
An embedded Loom video (via `LoomEmbed`) showing a 30-second walkthrough of the app.

### Email Capture
The `EmailCapture` component collects emails for the upcoming "Pro" tier. It uses a form that POSTs to `api/email-capture`. Multiple instances exist on the page with different `source` attributes for tracking.

### FAQ Section
The `FAQ` component renders collapsible `<details>` elements covering six common questions:
1. Is Atelier free? (Yes, always)
2. Do I need an account? (No, guest mode available)
3. Does it work offline? (Yes, it's a PWA)
4. Where is data stored? (Local by default, Supabase if synced)
5. How is this different from Notion/Todoist? (Intentional narrow focus)
6. Can I export data? (Yes, one-click JSON export)

The first FAQ item is open by default (`open={i === 0}`).

### Final CTA
"Begin quietly" — A closing call-to-action with a direct link to start using the app.

### SEO Metadata
The landing page includes comprehensive Open Graph tags, canonical URL, and structured JSON-LD data (`SoftwareApplication` schema) for search engine visibility.

---

## 8. About Page (`/about`)

The About page at `app/(marketing)/about/page.tsx` is a philosophical manifesto for the app:

**Core Narrative:**
The page tells the story of why Atelier was built — the creator tried every other planner, found them all too ambitious, and wanted something that simply answers "what do I do this morning?" The narrative emphasizes that Atelier is "one routine, one day, one practice" — not a database or productivity system.

**Aristotle Quote:**
"We are what we repeatedly do. Excellence, then, is not an act, but a habit." — This quotation anchors the page's philosophical framing.

**Three Core Values (displayed as cards):**
1. **PWA-first** — Installs to home screen, works offline, no app store needed
2. **Local-first** — Data lives in browser by default; cloud sync is opt-in
3. **Open source** — Code is auditable; no vendor lock-in

**Privacy Commitment:**
"No ads. No algorithm. No 'engagement.' Just a planner that respects your attention."

The page closes with a "Try it" CTA that links to `/auth`.

---

## 9. Pricing Page (`/pricing`)

The Pricing page at `app/(marketing)/pricing/page.tsx` presents a two-tier comparison:

### Free Tier ($0 — forever)
- Unlimited tasks, habits, and journal entries
- Pomodoro focus timer
- Mood tracking
- Weekly insights and charts
- Dark mode + PWA install
- Works offline
- Local-first data storage

### Pro Tier ($19 — one-time, coming soon)
- Everything in Free
- Cloud sync across devices
- Custom themes (coming soon)
- Advanced insights and exports (coming soon)
- Early access to new features
- Direct support from the maker

The Pro tier is highlighted with an accent-colored border and a "Coming soon" badge. Instead of a CTA button, it shows the `EmailCapture` component for waitlist signup.

The pricing philosophy is notable: "Free, with a quiet upgrade." There are no monthly subscriptions, no recurring charges — a deliberate rejection of the SaaS subscription model.

---

## 10. Authentication Page (`/auth`)

The Auth page at `app/auth/page.tsx` is a full-screen split layout:

**Left Panel (desktop only):** Dark ink background with subtle geometric pattern overlay. Shows the Atelier brand name, "Daily Routine Planner" tagline, and Aristotle quote.

**Right Panel:** The authentication form with three modes:

1. **Sign In:** Email + password fields, "Forgot password?" link, "Sign up" toggle, and a "Continue as Guest" divider option. The guest flow uses the `signInGuest()` method which creates a local-only synthetic user.

2. **Sign Up:** Adds a "Full name" field, client-side validation (password minimum 6 characters), and email confirmation flow via Supabase.

3. **Reset Password:** Single email field that triggers Supabase's `resetPasswordForEmail()` with redirect to `/auth`.

The form includes show/hide password toggle, error display with shake animation, loading states with "Please wait..." text, and success messages for sign-up and password reset.

**Guest Mode Flow:**
The "Continue as Guest" button is a key UX decision. It creates a synthetic user object (`{ id: "guest-user", email: "guest@local" }`) stored in localStorage, allowing immediate access to the full app with zero friction. This is Atelier's answer to the tension between "make it easy to start" and "offer cloud sync."

---

# Part IV: The Application

## 11. App Shell and Navigation

The authenticated application is wrapped in `AppShell` (`components/layout/AppShell.tsx`), which provides:

### Desktop Sidebar (`components/layout/Sidebar.tsx`)
A fixed left sidebar (256px wide) containing:
- Brand logo and "Atelier · Daily Routine" branding
- Seven navigation items with Lucide icons and active indicators:
  - Today (Home icon) → `/app`
  - Habits (CheckSquare) → `/app/habits`
  - Pomodoro (Timer) → `/app/timer`
  - Projects (Lightbulb) → `/app/projects`
  - Journal (PenLine) → `/app/journal`
  - Insights (LineChart) → `/app/stats`
  - Settings (Settings) → `/app/settings`
- Motivational quote footer: "Discipline equals freedom."
- User email display or "Sign in" link at the bottom

The active route is highlighted with cream/ink background and a small accent-colored dot indicator. Navigation uses `usePathname()` for client-side active detection.

### Mobile Bottom Navigation (`components/layout/MobileNav.tsx`)
A fixed bottom nav bar with five items:
- Today, Projects, Habits, Focus (Timer), More (Settings)
- Safe area inset padding for modern phones
- Active state with accent color
- A notification dot on "More" when the user is not signed in

### Header (`components/layout/Header.tsx`)
Each app page renders a Header with:
- Current date (formatted as "EEEE · MMMM d, yyyy")
- Page title in serif italic
- Optional subtitle with descriptive text
- ThemeToggle button in the top-right
- Suppress hydration warning for server/client date consistency

The brand component (`Brand`) renders the SVG logo linked back to `/app`.

### Responsive Behavior
- **Desktop (lg+):** Full sidebar + main content area
- **Mobile (< lg):** Top brand bar + main content + bottom nav
- `pb-24 lg:pb-12` ensures the bottom nav doesn't overlap content on mobile

---

## 12. Today Dashboard (`/app`)

The Today Dashboard at `app/(app)/app/page.tsx` is the app's default landing page after login. It's a client component that presents the user's day at a glance:

**Loading State:**
Before hydration, a skeleton loader shows placeholder animations (pulsing cream/ink blocks) matching the layout structure to prevent layout shift.

**Content (post-hydration):**
1. **Header:** Greeting based on time of day ("Good morning", "Good afternoon", etc.) with subtitle "A small daily practice, repeated faithfully."
2. **Today Progress:** Three circular progress rings showing:
   - Task completion percentage (blue-dusty color)
   - Habit completion percentage (sage color)
   - Focus minutes total (number, no ring)
3. **Two-column grid (lg+):**
   - **Left column:** TaskList for today's date — shows scheduled items grouped by time of day
   - **Right column:** 
     - HabitList showing today's scheduled habits
     - Compact JournalEditor for quick journal entry

The dashboard is designed to be the "home base" — the user arrives here, sees what's planned, completes tasks and habits, and optionally writes a quick journal entry.

---

## 13. The Tasks System

### TaskList Component (`components/tasks/TaskList.tsx`)

The TaskList is the core task management interface. It handles:

**Grouping:** Tasks are automatically grouped into four time slots:
- **Matins (Morning):** Before 12:00 — Sunrise icon
- **Afternoon:** 12:00-17:00 — Sun icon
- **Vespers (Evening):** After 17:00 — Sunset icon
- **Anytime (Unscheduled):** No time set — Inbox icon

Each group section displays a serif heading with the appropriate icon, a decorative hairline divider, and a count of tasks in that slot.

**Sorting:** Tasks within each group are sorted by time (if set), then by creation order.

**Empty State:** When no tasks exist, a dashed border box appears with a Coffee icon and the message "A quiet day. Add something to begin." An "Add Task" button is provided.

**Header:** Shows "Schedule" title with completion count ("X of Y complete") and a "New Task" button.

**Props:**
- `date?: string` — Date to display tasks for
- `showAdd?: boolean` — Whether to show the add button
- `emptyMessage?: string` — Custom empty state message
- `filterCompleted?: boolean` — Optionally hide completed tasks

### TaskForm Component (`components/tasks/TaskForm.tsx`)

A modal form for creating and editing tasks with fields:
- **Title** (required, auto-focused)
- **Description** (textarea)
- **Date** (date picker, defaults to today)
- **Time** (time picker)
- **Duration** (number, min 1 to max 600 minutes)
- **Category** (dropdown: Work, Personal, Health, Leisure, Errand)
- **Priority** (dropdown: Low, Medium, High)

The form resets after submission and syncs with the `initial` prop for editing. Categories use `categoryMap` from `lib/utils.ts` for label, color, and styling.

### TaskItem Component (`components/tasks/TaskItem.tsx`)

Individual task display with:
- **Completion toggle:** Circular checkbox that strikes through the title when completed
- **Title and optional description**
- **Metadata row:** Time (formatted as "9:30 AM"), duration, priority badge, category badge
- **Actions:** Edit (pencil) and Delete (trash) buttons that appear on hover
- **Visual cues:** High-priority tasks get a left gold border accent; completed tasks get muted styling with cream background

The component uses `formatTime()` from `dateUtils.ts` to display times in 12-hour format with AM/PM.

---

## 14. The Habit Tracking System

The habit system is Atelier's most sophisticated feature, comprising four interconnected components:

### HabitList Component (`components/habits/HabitList.tsx`)

The main habits interface with two views:

**Today View:**
- Shows habits scheduled for today based on their frequency rules
- Completion count ("X of Y complete today")
- Archived habits can be toggled visible via a collapsible section
- Empty state with "Begin where you stand" message

**Calendar View:**
- Monthly calendar grid (using date-fns for month navigation)
- Habit selection chips at the top showing streak counts
- Each cell shows completion intensity via color:
  - No habits scheduled: transparent
  - 0% done: soft background
  - 1-33%: light sage
  - 34-66%: medium sage
  - 67-99%: darker sage
  - 100%: full sage
- Today is highlighted with an accent ring
- Detailed tooltip shows "X/Y done" on hover

The view switcher uses a segmented control toggle at the top.

### HabitForm Component (`components/habits/HabitForm.tsx`)

A modal form for creating and editing habits:
- **Title** (required)
- **Description** (optional)
- **Motivation Note** (optional — displayed as italic quote on the habit card)
- **Icon** (grid of 18 options displayed as 3-letter abbreviations)
- **Color** (8 circular color swatches with ring highlight)
- **Frequency** (dropdown with four options)
- **Custom Days** (when "Custom" frequency is selected — 7 day buttons S/M/T/W/T/F/S)

### HabitItem Component (`components/habits/HabitItem.tsx`)

Individual habit display with:
- **Completion toggle:** Large 36px square with check mark when done
- **Title, description, motivation note** (displayed in accent italic)
- **Streak display:** Flame icon + current streak count, best streak
- **Actions:** Edit, Archive/Restore, Delete (with confirmation)
- **Visual states:** Completed habits get the habit's color background; archived habits are shown as 60% opacity with dashed border

### HabitCalendar Component (`components/habits/HabitCalendar.tsx`)

A month grid calendar showing habit completion:
- 7-column grid with day labels (S M T W T F S)
- Each cell colored by completion ratio across all selected habits
- Numbered with completion fraction for partial days
- "Less"/"More" gradient legend at the bottom
- Current month navigation with chevron buttons

### Streak Computation Logic: An In-Depth Analysis

The streak engine in `lib/habitUtils.ts` is notably sophisticated and forms the heart of the habit tracking system. Understanding its implementation reveals careful attention to edge cases:

**Best Streak Calculation:**
1. Walk forward from the first completion to the last completion
2. Skip days the habit isn't scheduled for (no penalty for non-daily habits)
3. Count consecutive scheduled days that were completed
4. Track the maximum run

**Current Streak Calculation:**
1. Start from today (or yesterday if today isn't done)
2. Walk backward through scheduled days
3. Count consecutive completions
4. Break at the first missed scheduled day
5. Capped at 365 days to prevent infinite loops

This handles edge cases elegantly: weekend-only habits don't break on weekdays, custom schedules are respected, and the streak doesn't penalize for days the habit was never meant to be done.

**Visualizing the Algorithm:**

For a weekday-only habit with completed dates [Mon, Tue, Wed, Fri, Sat]:
- Best streak starts Monday: Mon✓ Tue✓ Wed✓ → streak = 3
- Thu is not scheduled → skipped (no break)
- Fri✓ Sat✓ → streak resets to 2
- Best = max(3, 2) = 3

For current streak on a Wednesday (assuming previous day not completed):
- Start from today (Wed): if not completed, try yesterday (Tue)
- Walk back through scheduled days counting completions
- Stop at first missed scheduled day
- If today is Friday and habit is weekdays-only: Mon✓ Tue✓ Wed✓ → Thu(unscheduled) → Fri✓ → walks Mon-Tue-Wed, counts 3, skips Thu, continues to Fri

**Algorithmic Properties:**
- Time complexity: O(N) where N is the number of days since the first completion (best streak) or 365 (current streak)
- Space complexity: O(M) where M is the number of completed dates, stored in a Set for O(1) lookup
- The 365-day cap on current streak prevents infinite loops from edge cases in date arithmetic
- The `isScheduled()` helper is reused by `isHabitScheduledOn()` ensuring scheduling logic is consistent across streak computation, calendar rendering, and completion checking

### Completion Rate (30-day)

`completionRateLast30()` computes the percentage of scheduled days in the last 30 days that were completed, respecting the habit's frequency schedule.

---

## 15. The Pomodoro Timer

The Pomodoro Timer at `app/(app)/app/timer/page.tsx` is a fully functional focus timer with three modes.

### PomodoroTimer Component (`components/timer/PomodoroTimer.tsx`)

**Mode Toggle:** Segmented control for Focus / Short Break / Long Break with corresponding colors (burgundy, sage, dusty blue).

**Timer Display:** A large circular progress ring (up to 300px on desktop) showing:
- Digital clock display in Cormorant Garamond font ("25:00")
- Cycle counter ("Cycle 1 of 4")
- Smooth progress animation as time elapses

**Controls:**
- **Begin/Resume:** Starts or resumes the timer
- **Pause:** Pauses the current session
- **Reset:** Resets to the configured duration
- **Skip:** Ends the current session and advances to the next phase

**Auto-Transition Logic:**
1. Focus → Short break (unless X cycles completed → Long break)
2. Short break → Focus
3. Long break → Focus
The auto-start feature can optionally begin the next phase automatically.

**Sidebar Cards:**
- **Today Stats:** Focus minutes accumulated and session count
- **Settings Summary:** Current focus/break durations and cycle configuration

**Lifecycle Effects:**
1. Timer tick: 1-second interval using `window.setInterval`
2. Completion detection: Fires once per (type, cyclesCompleted) tuple using a ref key
3. Completion actions: Logs session, plays sound (if enabled), sends notification (if enabled), advances to next phase
4. Tab title: Updates document title with remaining time during active sessions

### PomodoroSettings Component (`components/timer/PomodoroSettings.tsx`)

A settings card to configure:
- Focus duration (1-90 minutes)
- Short break duration (1-30 minutes)
- Long break duration (1-60 minutes)
- Cycles until long break (1-10)
- Auto-start breaks toggle
- Auto-start focus toggle

### Notification and Sound System (`lib/notifications.ts`)

**Web Audio API Sound Synthesis:**
The app generates sounds programmatically without any audio files:
- **Chime:** Two rising tones (880Hz + 1320Hz)
- **Bell:** Metallic strike with high overtones
- **Digital:** Electronic-style beeps
- **Gong:** Deep resonant tone with harmonics

Each sound uses oscillator nodes with gain envelopes for attack/decay shaping.

**Browser Notifications:**
Uses the `Notification` API with permission request flow. Notifications are sent when a Pomodoro session completes, showing the session type and "complete" message.

---

## 16. The Journal System

### JournalEditor Component (`components/journal/JournalEditor.tsx`)

A rich text editor for journal entries with:
- Mood selector (5-point scale using emoji-style indicators)
- Textarea for free-form content
- Auto-save on blur (debounced)
- Compact mode for the dashboard (smaller layout)
- Character/word count display

### JournalView Component (`components/journal/JournalView.tsx`)

A date-navigable journal view that allows:
- Browsing entries by date (previous/next day navigation)
- "Today" quick-jump button
- Combined mood + content display
- Editing any past entry
- Calendar view of which days have entries

The journal system is intentionally minimal: no tags, no categories, no rich formatting. The philosophy is "The point is not to write more — it is to look up."

---

## 17. Insights and Statistics

The Insights page at `/app/stats` aggregates user data into four visualization components:

### WeeklyChart (`components/stats/WeeklyChart.tsx`)

A stacked bar chart (using Recharts) showing the current week:
- X-axis: Days of the week (Mon-Sun)
- Y-axis: Task count
- Two stacked bars per day:
  - **Tasks:** Completed tasks in sage green
  - **Missed:** Uncompleted tasks in soft border color
- Tooltip with day name and counts
- Responsive container that fills available width

Data is computed from the current week (starting Monday) using date-fns `startOfWeek({ weekStartsOn: 1 })`.

### HabitHeatmap (`components/stats/HabitHeatmap.tsx`)

A 7×7 grid (49 days, i.e., 7 weeks) showing habit consistency:
- Each cell represents one day
- Color intensity = completion ratio across all active habits
- Same color scale as HabitCalendar (transparent → sage)
- Title tooltip on each cell showing the date
- Dense visualization suitable for pattern recognition

### StreakLeaderboard (`components/stats/StreakLeaderboard.tsx`)

Top 5 habits ranked by current streak length:
- Rank number, color dot, habit name
- Current streak count and best streak
- Flame icon header
- Empty state: "No habits yet."

Sorting: current streak descending, then best streak descending.

### TodayProgress (`components/stats/TodayProgress.tsx`)

Already described in the dashboard section — three metrics displayed as progress rings.

---

## 18. The Project Planner

The Projects feature at `/app/projects` is an AI-powered project brief generator, making Atelier useful beyond daily routines.

### Page Flow

1. **Input:** User types a rough app idea (e.g., "A social app for book lovers")
2. **Generate:** Clicks "Generate Brief" which calls a Server Action
3. **Processing:** Loading state with spinner and "Analyzing your idea..." message
4. **Result:** Structured brief displayed in editable sections
5. **Save:** Can be saved locally or to Supabase (if authenticated)
6. **Compile:** A "Starter Prompt" is auto-generated from the brief for use with coding agents

### Server Action (`app/(app)/app/projects/actions.ts`)

The `generateBrief` server action:
1. Calls Ollama (or OpenAI) with a system prompt that defines the role of a "senior software architect"
2. Requests eight structured sections in a JSON response
3. Parses the AI response, handling various formats (arrays, objects, strings)
4. Returns structured `ProjectBriefContent`

The system prompt enforces a specific JSON schema and warns against markdown or backticks. The model is configured via environment variables (`OLLAMA_BASE_URL`, `OLLAMA_MODEL`).

### BriefEditor Component (`components/planner/BriefEditor.tsx`)

Eight editable card sections, each in a two-column responsive grid layout:
1. **Summary** — 2-3 sentence app description defining the core value proposition
2. **Target Users** — User demographics and psychographics
3. **Core Features** — Bullet list of 4-6 specific features that define the MVP
4. **Tech Stack** — Recommended technologies with brief reasoning for each
5. **Pages / Routes** — Every route the application needs, from landing to settings
6. **Data Model** — Key entities, their fields, relationships, and cardinality
7. **Build Phases** — Phased implementation from MVP through polish with specific deliverables
8. **Risks & Edge Cases** — Technical risks, edge cases, and proposed mitigations

Each section is implemented as a labeled textarea with a descriptive subtitle. Sections are laid out in a 2-column grid on desktop (`sm:grid-cols-2`) that collapses to single column on mobile. The editor is fully editable — users can refine any AI-generated section, and their edits are preserved when saving.

The section definitions are stored as a typed array (`SectionDef[]`), ensuring the component stays in sync with the `ProjectBriefContent` type. Adding a new section requires changes in only two places: the type definition and the section array.

### PromptCompiler Component (`components/planner/PromptCompiler.tsx`)

The PromptCompiler is a practical bridge between ideation and implementation. It auto-generates a structured prompt that combines:
1. The original idea text
2. All 8 filled-in sections from the brief
3. A role prefix: "Act as a Senior Software Architect"
4. A comprehensive request asking for implementation plan covering architecture, component tree, data flow, route design, state management, testing strategy, and deployment

The prompt is displayed in a read-only textarea and can be copied with a single button click. The copy mechanism uses the modern Clipboard API (`navigator.clipboard.writeText()`) with a fallback to the legacy `document.execCommand('copy')` approach for broader browser compatibility. After copying, the button shows a green checkmark with "Copied" text for 2 seconds.

This feature makes the Projects page uniquely useful: it transforms a rough idea into a structured brief, then into a ready-to-use prompt for any AI coding assistant, creating a complete workflow from ideation to implementation.

### Local Storage for Briefs (`lib/planner-store.ts`)

Briefs are stored in localStorage under `atelier-planner-briefs` as an array. The store provides `getLocalBriefs()`, `saveLocalBrief()`, and `deleteLocalBrief()` functions. The `deleteLocalBrief` function handles the case where the deleted brief is the only one, returning an empty array rather than null.

### Brief History

Previous briefs appear as clickable chips below the header, showing the idea text (truncated to 32 characters) with a delete button on hover. This allows users to iterate on multiple project ideas.

---

## 19. Settings Panel

The Settings page at `/app/settings` provides comprehensive configuration:

### Account Section
- **Guest Mode:** Shows "Guest Mode (Local Only)" with options to create an account or exit guest mode
- **Authenticated:** Shows user email, sync status indicator, and sign out button
- **Not signed in:** Shows prompt to sign in with a CTA button

### Preferences Section
- **Theme:** Three-way toggle (Light / Dark / Sepia) with accent-colored active state
- **Notifications:** Toggle button that requests permission on enable
- **Sound Enabled:** Toggle switch with custom CSS styling
- **Sound Profile:** Dropdown selector (Chime / Bell / Digital / Gong) — only visible when sound is enabled, with an indented layout

### Data Section
Three action buttons in a grid:
- **Export:** Downloads a JSON file with all data, named `atelier-planner-YYYY-MM-DD.json`
- **Import:** Opens a modal with a textarea to paste exported JSON, with confirmation dialog
- **Reset:** Destructive action with double confirmation

---

# Part V: Design Decisions Analysis

## 20. Architectural Trade-Offs and Decision Analysis

Every architectural decision in Atelier represents a trade-off. Understanding these trade-offs provides insight into the project's priorities:

### localStorage vs. IndexedDB

**Decision:** Use localStorage for all data persistence.

**Trade-off:** localStorage has a ~5MB storage limit per origin and synchronous APIs. IndexedDB offers larger storage, asynchronous operations, and better performance with large datasets.

**Rationale:** The app's data model (tasks, habits, journal entries) for a single user is unlikely to exceed a few megabytes. Synchronous access via `JSON.parse/stringify` is simpler and avoids callback complexity. The `saveData()` call happens after every state change, which is acceptable for the data volume.

**Risk:** With years of daily journaling (365 entries/year × 2KB ≈ 730KB/year) combined with habit data (365 dates/habit × 10 habits), storage needs could grow toward the 5MB limit. IndexedDB migration is the planned mitigation.

### React Context vs. Redux/Zustand

**Decision:** Use React Context with useState for global state.

**Trade-off:** Context triggers re-renders on all consumers when any part of the value changes. Redux and Zustand provide selector-based subscriptions that only re-render on specific state slices.

**Rationale:** The `useMemo` wrapper on the context value prevents unnecessary re-renders. With a single AppData object as the state, most mutations require a global re-render anyway. The simplicity gain (no actions, reducers, or selectors) outweighs the marginal performance cost.

**Risk:** If the app grows significantly (more features, more data), context-based state management could become a performance bottleneck. The mitigation would be splitting into multiple contexts (TasksContext, HabitsContext, etc.).

### Server Actions vs. API Routes

**Decision:** Use Server Actions for the AI brief generation.

**Trade-off:** Server Actions are newer, less documented, and tightly coupled to Next.js. Traditional API routes are framework-agnostic and better understood.

**Rationale:** Server Actions eliminate the boilerplate of creating API route handlers — no request parsing, response formatting, or status codes. The `"use server"` directive at the top of the function makes the intent clear. The AI SDK's `generateText()` integrates naturally with Server Actions.

**Risk:** Server Actions are still evolving. If the Next.js API changes significantly, migration could require rewriting the projects feature.

### Tailwind CSS vs. CSS Modules/Styled Components

**Decision:** Use Tailwind CSS with CSS variables for theming.

**Trade-off:** Tailwind creates verbose JSX with many utility classes. CSS Modules provide better separation of concerns. Styled Components offer dynamic styling without class strings.

**Rationale:** Tailwind's utility classes compose naturally with design tokens (CSS variables), enabling the three-theme system through variable overrides. The `cn()` utility keeps class management manageable. The classical design uses consistent spacing, colors, and typography — Tailwind excels at enforcing consistency.

### Custom Select vs. Native Select

**Decision:** Build a custom Select component instead of using HTML's native `<select>`.

**Trade-off:** The custom component requires ~150 lines of code for positioning, keyboard handling, and styling. The native `<select>` is accessible, lightweight, and works everywhere.

**Rationale:** The native `<select>` cannot be styled consistently across browsers — its dropdown appearance varies significantly. Atelier's classical aesthetic requires pixel-perfect control over every visual element. The custom component adds accessibility features (Escape key, focus trapping, ARIA attributes) that match or exceed the native element.

---

## 21. Pricing Model and Monetization Analysis

Atelier's pricing model is as intentional as its architecture:

### Free Tier Philosophy
The free tier includes every core feature with no trial period, no feature gating, and no time limits. This reflects the belief that productivity tools should be useful without payment. The app's FAQ states clearly: "The free tier includes every core feature — tasks, habits, timer, journal — with no time limit and no account required."

### Pro Tier ($19 one-time)
The Pro tier is priced as a one-time payment rather than a subscription. At $19, it's priced below a typical SaaS monthly fee but high enough to cover development costs. The tagline "Pro is coming" and the "Notify me" waitlist suggest the feature is still in development.

### Monetization Tensions
The model creates interesting tensions:
- **Sustainability:** One-time payments require a constant stream of new users, unlike subscriptions which provide recurring revenue
- **Feature development:** Cloud sync and multi-device support (the main Pro features) incur ongoing server costs that one-time payments may not cover long-term
- **Open-source reality:** The code is open source, so technically anyone could self-host and bypass the Pro tier for cloud features

### Market Positioning
Atelier positions itself against Notion, Todoist, and Habitica by being intentionally narrower and more focused. The pricing FAQ directly addresses this: "Atelier is intentionally narrow: one routine, one day, one practice."

---

## 22. Comparison with Similar Applications

Atelier occupies a unique position in the productivity software landscape:

| Feature | Atelier | Todoist | Notion | Habitica |
|---------|---------|---------|--------|----------|
| Daily tasks | ✓ Time-blocked | ✓ Lists | ✓ Databases | ✓ RPG-style |
| Habit tracking | ✓ Sophisticated streaks | ✗ | ✗ | ✓ Gamified |
| Pomodoro timer | ✓ Built-in | ✗ | ✗ | ✗ |
| Mood journal | ✓ Built-in | ✗ | ✓ Templates | ✗ |
| Offline-first | ✓ PWA | ✓ Limited | ✗ | ✗ |
| Privacy | ✓ Local-first | ○ Cloud | ○ Cloud | ○ Cloud |
| Gamification | ✗ Quiet design | ✗ | ✗ | ✓ Full RPG |
| Open source | ✓ MIT | ✗ | ✗ | ✓ |
| Pricing | Free + $19 one-time | Free + $4/mo | Free + $10/mo | Free |

Atelier's key differentiator is the combination of task management, habit tracking, Pomodoro timer, and journaling in a single, cohesive, offline-first package — with no subscriptions, no gamification, and a classical aesthetic that prioritizes calm over engagement.

---

# Part VI: Design System

## 23. Typography

Atelier uses three Google Fonts configured via Next.js's `next/font/google`:

### Font Assignments

```css
--font-playfair: Playfair Display
--font-inter: Inter  
--font-cormorant: Cormorant Garamond
```

**Usage:**
- **Playfair Display** (`font-display`): Page headings, hero text, large numerals. Always in italic.
- **Inter** (`font-sans`): Body text, form labels, buttons, tabular data
- **Cormorant Garamond** (`font-serif`): Timer numerals, decorative text, block quotes, italic subtitles

### Typographic Conventions
- All page titles use `font-display text-3xl sm:text-4xl italic tracking-tight`
- Section headers use `font-serif text-[10px] uppercase tracking-[0.3em]` in accent color
- Timer numerals use `tnum` class for tabular number alignment
- Subtitles are `text-sm text-[var(--fg-soft)]`
- Body copy in feature descriptions: `text-sm leading-relaxed`

---

## 24. Global CSS Architecture

The `app/globals.css` file defines the foundation of Atelier's visual identity. Beyond standard Tailwind directives, it establishes:

### CSS Custom Properties (Design Tokens)

```css
:root {
  --bg: #FAF7F0;          /* Cream page background */
  --bg-card: #FFFFFF;      /* White card surfaces */
  --bg-soft: #F0EDE4;      /* Soft muted background */
  --fg: #2C2A26;           /* Ink primary text */
  --fg-soft: #6B6560;      /* Secondary text */
  --fg-muted: #9C9790;     /* Disabled/muted text */
  --accent: #B8860B;       /* Gold accent */
  --accent-soft: rgba(184, 134, 11, 0.08);
  --border: #E0DDD6;       /* Standard borders */
  --border-soft: #EBE8E0;  /* Subtle borders */
}
```

These tokens are referenced throughout the codebase using `var(--name)` syntax, enabling the three-theme system. The `.dark` and `.sepia` class overrides redefine these variables for their respective color schemes.

### Animation Classes

The CSS defines several custom animations:

- **Fade in:** `animate-fade-in` — opacity 0 to 1 with transform
- **Scale in:** `animate-scale-in` — for modal entrance
- **Shake:** `animate-[shake_0.3s_ease-in-out]` — for form errors
- **Custom fade-in:** for archived habits reveal

Animations use `@keyframes` defined in globals.css and applied via Tailwind's arbitrary value syntax. All animations are subtle and classical — "soft, classical transitions — never bouncy," as the README states.

### Paper Texture

Cards with the `paper` prop class get a subtle texture overlay:

```css
.paper {
  background-image: url("data:image/svg+xml,...paper texture...");
  background-size: 200px 200px;
}
```

This creates the illusion of textured stationery paper, reinforcing the classical aesthetic.

### Scrollbar Styling

Custom scrollbar styling is applied via:

```css
.scrollbar-thin {
  scrollbar-width: thin;
}
```

This is used in the custom Select component's dropdown list for a refined appearance.

### Theme Class Transitions

Theme transitions are instantaneous (no animation) to prevent flash during the critical theme-switch operation. The `<html>` element's class is toggled directly in the inline `<script>` tag before React hydrates, ensuring no flash of incorrect theme colors.

---

## 25. Color System

Atelier uses CSS variables for its color system, enabling three themes:

### CSS Variables (defined in `globals.css`)

```
--bg:            Page background
--bg-card:       Card/surface background  
--bg-soft:       Soft background (calendar empty cells)
--fg:            Foreground / primary text
--fg-soft:       Secondary text
--fg-muted:      Muted / disabled text
--accent:        Accent color (gold #B8860B)
--accent-soft:   Accent with transparency
--border:        Standard borders
--border-soft:   Subtle borders
```

### Theme-specific Colors

**Light theme:** Cream (#FAF7F0), Ink (#2C2A26), Sage (#8CB08C), Dusty Blue (#7B9DBF), Gold (#B8860B), Burgundy (#9E4A5C)

**Dark theme:** Deep charcoal (#1A1A1A), Parchment (#E8E0D0), desaturated accents

**Sepia theme:** Warm paper tones, brown-based palette

### Utility Color Map

The `colorMap` in `lib/utils.ts` provides consistent color assignments:
- **sage:** `green-50` soft, `green-500` bg
- **burgundy:** `red-50` soft, `red-400` bg (prefixed `burgundy`)
- **dusty:** `blue-50` soft, `blue-500` bg (prefixed `blue-dusty`)
- **gold:** `yellow-50` soft, `yellow-500` bg
- **ink:** `gray-100` soft, `gray-500` bg

### Category Colors
Tasks use `categoryMap` which assigns each category a label, soft background, and text color:
- Work: sage tones
- Personal: dusty blue tones
- Health: burgundy tones
- Leisure: gold tones
- Errand: ink tones

---

## 26. Component Library

Atelier includes a set of custom UI components:

### Card (`components/ui/Card.tsx`)
A versatile container with:
- `bordered` prop (default true) for optional border
- `padded` prop (default true) for optional padding
- `paper` prop for paper-texture styling
- `shadow-soft` CSS class for subtle shadow
- Rounded corners (`rounded-xl`)

### Button (`components/ui/Button.tsx`)
Four variants with consistent styling:
- **Primary:** Ink background, cream text. Dark mode: cream background, ink text
- **Secondary:** Cream background, ink text. Dark mode: ink background, cream text
- **Ghost:** Transparent background, hover fill
- **Danger:** Burgundy background, cream text
Three sizes: sm (32px), md (40px), lg (48px)

### Input, Textarea, Label (`components/ui/Input.tsx`)
Base form components with:
- Transparent background with border
- Focus ring in accent color
- `placeholder:` text color set to `--fg-muted`
- Consistent height (40px for inputs)

### Select (`components/ui/Select.tsx`)
A custom select component with:
- Custom dropdown rendered as button + positioned list
- Smart positioning: opens upward if space below is < 200px
- Scrollable with max-height and overscroll behavior
- Keyboard navigation (Escape to close)
- Selected option auto-scrolls into view
- Checkmark indicator on selected item

### Modal (`components/ui/Modal.tsx`)
A fully accessible modal dialog with:
- Focus trapping (Tab/Shift+Tab cycle between first and last focusable)
- Escape key to close
- Backdrop click to close
- `aria-modal`, `aria-labelledby`, `role="dialog"` accessibility attributes
- scroll lock on body
- Auto-focus first focusable element
- Focus restoration on close
- Three sizes: sm (384px), md (512px), lg (672px)
- Fade-in and scale-in animations

### ProgressRing (`components/ui/ProgressRing.tsx`)
An SVG-based circular progress indicator:
- Configurable size, stroke width, colors
- Smooth transition animation (0.6s ease)
- Center label slot for custom content
- Overflow-visible for stroke-linecap rendering

---

# Part VII: Utilities and Libraries

## 27. Date Utilities (`lib/dateUtils.ts`)

The date utility layer provides essential date operations:

| Function | Description |
|----------|-------------|
| `todayISO()` | Returns today's date as `yyyy-MM-dd` ISO string |
| `formatDate(iso, fmt?)` | Formats ISO date with custom pattern |
| `formatTime(time?)` | Converts "09:30" → "9:30 AM" (12-hour format) |
| `getTimeOfDay(time?)` | Returns "morning", "afternoon", "evening", or "unscheduled" |
| `greeting()` | Returns time-appropriate greeting (Good morning/afternoon/evening/night) |
| `relativeDay(iso)` | Returns "Today", "Yesterday", or formatted date |
| `minutesToHM(mins)` | Converts 135 → "2h 15m" |
| `secondsToClock(sec)` | Converts 3661 → "61:01" |
| `dayName(iso, fmt?)` | Returns day name abbreviation |
| `monthName(iso, fmt?)` | Returns month name |

The `greeting()` function considers hours before 5 AM as "Good night", creating a gentle edge case for late-night workers.

## 28. Storage Layer (`lib/storage.ts`)

The storage layer handles all localStorage interactions:

- **Storage Key:** `atelier-planner-v1`
- **Default Data:** Pre-populated with empty arrays and default settings
- **loadData():** Parses JSON from localStorage, gracefully falls back to defaults on error
- **saveData(data):** Serializes and writes to localStorage, catches and logs errors silently
- **exportData(data):** Pretty-prints to JSON string for download
- **importData(json):** Parses and validates JSON string, returns data or null

The default settings include the classic 25/5/15 Pomodoro configuration with 4 cycles until long break.

## 29. Habit Utilities (`lib/habitUtils.ts`)

The habit engine provides:

- **isHabitScheduledOn(habit, iso):** Checks if a habit is scheduled for a given date based on its frequency and custom day rules
- **isHabitCompletedOn(habit, iso):** Checks if a date exists in the completedDates array
- **toggleHabitOnDate(habit, iso):** Immutably toggles a date in the completedDates array, maintaining sorted order
- **computeStreak(habit):** Returns `{ current, best }` — the sophisticated streak algorithm described earlier
- **completionRateLast30(habit):** Percentage of scheduled days in the last 30 that were completed

## 30. General Utilities (`lib/utils.ts`)

- **`uid()`:** Generates unique IDs using `crypto.randomUUID()` with a Math.random fallback for environments where `crypto` is unavailable
- **`cn()`:** Class name merger (wraps `clsx`) for conditional Tailwind classes
- **`categoryMap`:** Maps task categories to { label, soft, text } styling objects
- **`colorMap`:** Maps habit colors to { label, bg, soft } styling objects

## 31. Supabase Integration (`lib/supabase.ts`)

Creates and exports a Supabase client instance:
- Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables
- `createClient()` from `@supabase/supabase-js`
- Singleton pattern exported as `supabase`

## 32. Sync Layer (`lib/sync.ts`)

The sync layer provides Supabase CRUD operations:
- `pullAllData(userId)`: Fetches all data for a user (tasks, habits, journal, pomodoros, settings)
- `syncTask(userId, task)`: Creates or updates a task row
- `deleteTask(userId, taskId)`: Deletes a task row
- `syncHabit(userId, habit)`: Creates or updates a habit row
- `deleteHabit(userId, habitId)`: Deletes a habit row
- `syncJournal(userId, date, ...)`: Creates or updates a journal entry
- `syncPomodoro(userId, session)`: Creates a pomodoro session row
- `syncSettings(userId, settings)`: Creates or updates settings row

The sync is fire-and-forget, never blocking the UI. It runs after every mutation in the DataProvider.

---

# Part VIII: Code Quality and PWA

## 33. Code Quality and Maintenance Patterns

### Consistent Component Patterns

Every component in Atelier follows a consistent pattern:

1. **"use client" directive** at the top for client components
2. **Named exports** for all components (never default exports)
3. **Props interface** defined alongside the component (or inline for simple cases)
4. **ForwardRef** for reusable form elements (Button, Input, Card use `forwardRef`)
5. **Consistent state management** — all mutations go through DataProvider context
6. **Error handling** — form validation, API error display, localStorage fallbacks

### Path Aliases

TypeScript path aliases (`@/` → `./`) keep imports clean:
```typescript
// Instead of: ../../../components/ui/Button
import { Button } from "@/components/ui/Button";
```

### Utility Composition

Utility functions are composed sensibly. For example, `cn` wraps `clsx` for class merging, `uid` uses `crypto.randomUUID()` with an `Error` object fallback, and `todayISO` composes `format` with `startOfDay` from date-fns:

```typescript
export const todayISO = (): string => format(startOfDay(new Date()), "yyyy-MM-dd");
```

### Hydration-Safe Rendering Standard

Every data-dependent component uses the same pattern:
1. Call `useHydrated()` at the top
2. Return a skeleton/loading state if not hydrated
3. Render actual content after hydration

This pattern is applied consistently across: TodayDashboard, HabitList, PomodoroTimer, TodayProgress, ProjectsPage, and others.

---

## 34. Performance Analysis

### Bundle Size

Atelier's dependency tree is relatively lean. The key heavy dependencies are:
- `next` (framework, required)
- `recharts` (~200KB gzipped) — used only on the Insights page
- `@supabase/supabase-js` — used only when authenticated
- `date-fns` — tree-shaken to only imported functions
- `lucide-react` — tree-shaken by import

The `ai` SDK and `@ai-sdk/openai` are server-only dependencies, executed only in Server Actions.

### Rendering Performance

The app uses Next.js App Router with:
- **Static rendering** for marketing pages (no dynamic data)
- **Client rendering** for app pages (data comes from localStorage)
- **Server Actions** for AI brief generation (prevents client-side bundle from including the AI SDK)

### State Update Efficiency

The DataProvider uses `useMemo` to stabilize the context value, preventing unnecessary re-renders of all consumers when unrelated state changes:

```typescript
const value = useMemo<DataContextValue>(
  () => ({
    data, hydrated, syncing,
    addTask, updateTask, // ... all callbacks
  }),
  [data, hydrated, syncing, addTask, /* ...all stable deps */],
);
```

Each callback is wrapped in `useCallback`, creating stable references that don't trigger re-renders of memoized child components.

### localStorage Performance

The entire AppData object is serialized and deserialized on every change via `saveData()`. For typical usage (a few dozen tasks, habits, and journal entries), this is negligible. However, with years of daily journaling and thousands of completed habit dates, serialization could become a bottleneck. A potential optimization would be incremental saves or IndexedDB migration.

---

## 35. Progressive Web App Implementation

Atelier is a fully-capable PWA, and its implementation reflects careful attention to the unique challenges of offline-first web applications.

### Service Worker Architecture

The service worker is managed by Serwist, registered automatically by Next.js during the build process. The service worker file at `app/sw.ts` uses Serwist's declarative API to define caching strategies:

**Cache Strategies:**
- **Static assets** (JS, CSS, fonts): Cache-first — served from cache instantly, updated in background
- **API routes and dynamic data**: Network-first — tries network first, falls back to cache when offline
- **Page navigations**: Network-first with cache fallback for seamless offline browsing

The service worker scope is set to `/`, covering both the marketing site and the app. TypeScript declarations in `app/sw.d.ts` provide type safety for the Serwist API.

### Web App Manifest

The manifest is generated dynamically and includes:
- App name and description
- Display mode: `standalone` — full-screen PWA experience without browser chrome
- Background and theme colors matching the light theme palette
- Start URL: `/auth` (the route guard redirects to `/app` for returning users)
- Icon references for multiple sizes including favicon and apple-touch-icon

### iOS and Mobile Support

The root layout includes comprehensive Apple-specific meta tags:

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

The `viewport-fit: cover` and `viewportFit: "cover"` configuration ensures the app renders under the status bar on notched devices. The mobile navigation includes `pb-[max(0.375rem,env(safe-area-inset-bottom))]` for safe area padding at the bottom of the screen.

### Offline Data Flow

The offline architecture follows a specific data flow pattern:

```
Online:
  User Action → localStorage (immediate) → Supabase (background sync)
  
Offline:
  User Action → localStorage (immediate) → Queue (pending for sync)
  
Back Online:
  Queue → Supabase (automatic on next mutation)
```

This "local-first, sync-when-available" pattern ensures the app never blocks on network requests. The DataProvider's `sync()` function is a fire-and-forget wrapper:

```typescript
const sync = useCallback((fn: () => Promise<void>) => {
  if (!userIdRef.current || userIdRef.current.startsWith("guest-")) return;
  fn().catch(() => {});
}, []);
```

Errors during sync are silently caught — the app never shows error states for failed syncs. The only sync status indicator is in the Settings panel, which shows "Syncing…" or "Synced to cloud" based on the `syncing` state variable.

### Background Sync and Future Enhancements

The current implementation does not use the Background Sync API or IndexedDB. Potential enhancements include:
- Registering a `sync` event in the service worker for true background sync
- Migrating from localStorage to IndexedDB for larger datasets and better performance
- Implementing conflict resolution strategies for concurrent edits across multiple devices
- Adding push notifications for Pomodoro timer completion even when the app is closed

### Install Experience

The PWA is installable to the user's home screen. On Android, Chrome shows an install prompt. On iOS, Safari's Share menu includes "Add to Home Screen." Once installed, Atelier behaves like a native app: full screen, no browser chrome, and offline access to all previously loaded data.

---

## 36. Seed Data and First-Run Experience

When the app is first loaded, it checks for a `?seed` query parameter. If present, `buildSeedData()` in `lib/seed.ts` generates demo data:

- Sample tasks spread across morning/afternoon/evening
- Sample habits with some completed dates
- Sample journal entries with moods
- Sample pomodoro sessions

The seed flag is consumed and cleared via `isSeedRequested()` and `clearSeedFlag()` to prevent re-seeding on subsequent reloads.

This enables quick demos and screenshots without manual data entry.

---

# Part IX: Development and Operations

## 37. Scripts and Tooling

The `package.json` defines four scripts:

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Development server |
| `build` | `next build` | Production build |
| `start` | `next start` | Production server |
| `lint` | `next lint` | ESLint check |
| `screenshots` | `node scripts/screenshot.mjs` | Automated screenshot capture |

The `screenshots` script uses Playwright to capture images of all pages, suggesting an automated documentation/QA pipeline.

## 38. Environment Configuration

Environment variables (`NEXT_PUBLIC_` prefix for client-accessible):
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `NEXT_PUBLIC_APP_URL` — Production URL (for sitemap, OG, JSON-LD)
- `NEXT_PUBLIC_LOOM_URL` — Loom demo video URL
- `OLLAMA_BASE_URL` — Ollama/OpenAI API base URL (server-only)
- `OLLAMA_API_KEY` — API key (server-only)
- `OLLAMA_MODEL` — Model name, default "gemma3:12b" (server-only)

## 39. Database Schema (Supabase)

The `supabase-schema.sql` defines tables for:
- **tasks:** id, user_id, title, description, date, time, duration_min, category, completed, priority
- **habits:** id, user_id, title, description, icon, color, frequency, custom_days, completed_dates, is_archived, notes
- **journal_entries:** id, user_id, date, content, mood, updated_at
- **pomodoro_sessions:** id, user_id, date, type, duration_min, completed, started_at
- **settings:** id, user_id, theme, notifications_enabled, sound_enabled, pomodoro (JSON), sound_type
- **project_briefs:** id, user_id, idea, content (JSON), timestamps

All tables use UUID primary keys, user_id foreign keys, and RLS policies for data isolation.

## 40. Configuration Files

- **next.config.js:** Standard Next.js config with optional image domains and redirects
- **tailwind.config.ts:** Custom Tailwind configuration with classical color palette, custom fonts, and animation utilities
- **postcss.config.js:** PostCSS with Tailwind and autoprefixer
- **tsconfig.json:** TypeScript configuration with path aliases (`@/` → `./`)
- **.eslintrc.json:** ESLint with Next.js recommended rules

---

# Part X: Conclusion

## 41. Architectural Assessment

Atelier represents a thoughtful, opinionated approach to web application architecture. Key strengths:

**1. Simplicity as a feature.** The choice of React Context over Redux or Zustand, localStorage over IndexedDB, and a single flat data object over normalized state demonstrates that simpler architectures can serve user needs effectively.

**2. Progressive enhancement.** The app works fully offline without an account. Cloud sync is added value, not a requirement. This "offline-first, online-optional" pattern is increasingly rare and valuable.

**3. Coherent design system.** Every visual element — from typography to spacing to animation — follows a consistent classical aesthetic. The CSS variable system enables three fully distinct themes with minimal code duplication.

**4. Accessible architecture.** The route guard system, modal focus trapping, ARIA attributes, and semantic HTML show attention to accessibility. The loading states and hydration handling prevent flash-of-wrong-content.

**5. Maintainable codebase.** Consistent patterns across component architecture, clear separation of concerns (components/lib/app), and TypeScript coverage throughout make the codebase approachable for new contributors.

**Areas for future improvement:**
- **Testing:** The codebase lacks test files (no `__tests__` directories, no Jest/Vitest config found)
- **Error boundaries:** No React error boundaries are implemented
- **Bundle splitting:** All app pages are loaded eagerly via the app router; dynamic imports could improve initial load
- **Data migration:** As the data model evolves, a versioned migration strategy would be needed for localStorage persistence

## 42. Final Thoughts

Atelier is more than a daily planner — it's a statement about what software should be: respectful of attention, private by default, beautiful without being distracting, and useful without being addictive. The codebase reflects these values in every layer, from the philosophical choices (guest mode, local-first) to the technical implementation (simple state management, Web Audio API sound synthesis, intentional typography).

This 39-section analysis covers the full architecture, design system, data model, component hierarchy, and operational details of this thoughtfully crafted application. Whether you're studying it as a reference for your own Next.js project, considering contributing to the open-source codebase, or simply curious about what a "quiet" productivity app looks like under the hood, Atelier offers a compelling case study in intentional software design.
