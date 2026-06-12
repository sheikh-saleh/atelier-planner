# Sepia Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Sepia theme as a third option alongside Light and Dark themes in the Atelier planner app.

**Architecture:** CSS Class-based approach adding `.sepia` class alongside `.dark`, with CSS variables in globals.css and ThemeProvider handling 3 states.

**Tech Stack:** Next.js, React, Tailwind CSS, TypeScript

---

## File Structure

| File | Responsibility |
|------|----------------|
| `lib/types.ts` | Theme type definition |
| `app/globals.css` | CSS variables for sepia theme |
| `components/providers/ThemeProvider.tsx` | Theme state management |
| `components/settings/SettingsPanel.tsx` | Theme selection UI |
| `components/ui/ThemeToggle.tsx` | Theme cycling toggle |
| `app/layout.tsx` | Theme script for SSR |
| `tailwind.config.ts` | Sepia color palette |

---

## Task 1: Update Theme Type

**Files:**
- Modify: `lib/types.ts:62-68`

- [ ] **Step 1: Update Settings interface**

```typescript
// lib/types.ts - line 62-68
export interface Settings {
  theme: "light" | "dark" | "sepia";
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  pomodoro: PomodoroConfig;
  soundType?: "chime" | "bell" | "digital" | "gong";
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat(theme): add sepia to Theme type"
```

---

## Task 2: Add Sepia CSS Variables

**Files:**
- Modify: `app/globals.css:68-129`

- [ ] **Step 1: Add .sepia class after .dark class**

```css
/* app/globals.css - after line 129 (after .dark closing brace) */

.sepia {
  --bg: #F5F0E6;
  --bg-soft: #EDE7D8;
  --bg-card: #FAF7F0;
  --fg: #3D3830;
  --fg-soft: #706858;
  --fg-muted: #A89E8C;
  --border: #D8D0C2;
  --border-soft: #E8E0D4;
  --accent: #5A7794;
  --accent-soft: #D6DFE8;

  /* Sepia scale */
  --sepia-50: #FAF7F0;
  --sepia-100: #F5F0E6;
  --sepia-200: #EDE7D8;
  --sepia-300: #D8D0C2;
  --sepia-400: #A89E8C;
  --sepia-500: #706858;

  /* Reuse existing scales with sepia overrides */
  --cream-50: #FCFAF6;
  --cream-100: #FAF7F0;
  --cream-200: #F5F0E6;
  --cream-300: #EDE7D8;
  --cream-400: #D8D0C2;

  --ink-50: #FAF7F0;
  --ink-100: #E8E0D4;
  --ink-200: #A89E8C;
  --ink-300: #706858;
  --ink-400: #3D3830;
  --ink-500: #2A2520;
  --ink-600: #1F1A16;
  --ink-700: #151210;

  --shadow: 61, 56, 48;
}
```

- [ ] **Step 2: Verify CSS syntax**

Run: `npm run build 2>&1 | head -20`
Expected: No CSS parse errors

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(theme): add sepia CSS variables"
```

---

## Task 3: Update ThemeProvider

**Files:**
- Modify: `components/providers/ThemeProvider.tsx:6,27-37`

- [ ] **Step 1: Update Theme type import**

```typescript
// components/providers/ThemeProvider.tsx - line 6
type Theme = "light" | "dark" | "sepia";
```

- [ ] **Step 2: Update theme sync useEffect**

```typescript
// components/providers/ThemeProvider.tsx - lines 27-33
// Sync the dark class to <html> whenever the theme changes
useEffect(() => {
  if (!hydrated) return;
  const root = document.documentElement;
  root.classList.remove("dark", "sepia");
  if (theme === "dark") root.classList.add("dark");
  else if (theme === "sepia") root.classList.add("sepia");
}, [theme, hydrated]);
```

- [ ] **Step 3: Update toggleTheme callback**

```typescript
// components/providers/ThemeProvider.tsx - lines 35-37
const toggleTheme = useCallback(() => {
  const next = theme === "light" ? "dark" : theme === "dark" ? "sepia" : "light";
  setSettings({ theme: next });
}, [theme, setSettings]);
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add components/providers/ThemeProvider.tsx
git commit -m "feat(theme): update ThemeProvider for 3 themes"
```

---

## Task 4: Update SettingsPanel

**Files:**
- Modify: `components/settings/SettingsPanel.tsx:118`

- [ ] **Step 1: Update theme toggle buttons**

```typescript
// components/settings/SettingsPanel.tsx - lines 118-129
{(["light", "dark", "sepia"] as const).map((t) => (
  <button
    key={t}
    onClick={() => setTheme(t)}
    className={`px-3 h-8 text-xs font-medium rounded capitalize ${
      theme === t ? "bg-[var(--accent)] text-cream-50" : "text-[var(--fg-soft)]"
    }`}
  >
    {t}
  </button>
))}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/settings/SettingsPanel.tsx
git commit -m "feat(theme): add sepia option to settings"
```

---

## Task 5: Update ThemeToggle

**Files:**
- Modify: `components/ui/ThemeToggle.tsx:12,23,26`

- [ ] **Step 1: Update aria-label**

```typescript
// components/ui/ThemeToggle.tsx - line 23
aria-label={
  mounted
    ? theme === "dark"
      ? "Switch to sepia"
      : theme === "sepia"
      ? "Switch to light"
      : "Switch to dark"
    : "Toggle theme"
}
```

- [ ] **Step 2: Update icon display**

```typescript
// components/ui/ThemeToggle.tsx - line 26
{mounted && (theme === "dark" ? (
  <Sun className="h-4 w-4" />
) : theme === "sepia" ? (
  <Moon className="h-4 w-4" />
) : (
  <Moon className="h-4 w-4" />
))}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add components/ui/ThemeToggle.tsx
git commit -m "feat(theme): update ThemeToggle for 3 themes"
```

---

## Task 6: Update Layout Theme Script

**Files:**
- Modify: `app/layout.tsx:96-112`

- [ ] **Step 1: Update theme script**

```typescript
// app/layout.tsx - lines 96-112
const themeScript = `
(function() {
  try {
    var raw = localStorage.getItem('atelier-planner-v1');
    var theme = 'light';
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.settings) {
        theme = parsed.settings.theme || 'light';
      }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    }
    document.documentElement.classList.remove('dark', 'sepia');
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else if (theme === 'sepia') document.documentElement.classList.add('sepia');
  } catch (e) {}
})();
`;
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(theme): update layout theme script for sepia"
```

---

## Task 7: Update Tailwind Config

**Files:**
- Modify: `tailwind.config.ts:18-68`

- [ ] **Step 1: Add sepia color scale**

```typescript
// tailwind.config.ts - after line 68 (after burgundy colors)
sepia: {
  50: "#FAF7F0",
  100: "#F5F0E6",
  200: "#EDE7D8",
  300: "#D8D0C2",
  400: "#A89E8C",
  500: "#706858",
},
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: Build completes successfully

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat(theme): add sepia colors to tailwind config"
```

---

## Task 8: Manual Verification

- [ ] **Step 1: Start dev server**

Run: `npm run dev`
Expected: Server starts on http://localhost:3000

- [ ] **Step 2: Test theme switching**

1. Navigate to Settings page
2. Click "Sepia" theme button
3. Verify background changes to warm cream (#F5F0E6)
4. Verify accent color is dusty blue (#5A7794)
5. Click "Dark" - verify dark theme works
6. Click "Light" - verify light theme works
7. Click "Sepia" again - verify it returns to sepia

- [ ] **Step 3: Test persistence**

1. Select Sepia theme
2. Refresh page
3. Verify Sepia theme is still active

- [ ] **Step 4: Test ThemeToggle button**

1. Click the theme toggle button in header
2. Verify it cycles: Light → Dark → Sepia → Light

- [ ] **Step 5: Test all pages**

1. Navigate through all pages (Today, Habits, Timer, Journal, Stats)
2. Verify Sepia theme renders correctly on each page

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat(theme): complete sepia theme implementation"
```

---

## Summary

| Task | Description | Files Changed |
|------|-------------|---------------|
| 1 | Update Theme type | lib/types.ts |
| 2 | Add CSS variables | app/globals.css |
| 3 | Update ThemeProvider | components/providers/ThemeProvider.tsx |
| 4 | Update SettingsPanel | components/settings/SettingsPanel.tsx |
| 5 | Update ThemeToggle | components/ui/ThemeToggle.tsx |
| 6 | Update layout script | app/layout.tsx |
| 7 | Update Tailwind config | tailwind.config.ts |
| 8 | Manual verification | None (testing only) |
