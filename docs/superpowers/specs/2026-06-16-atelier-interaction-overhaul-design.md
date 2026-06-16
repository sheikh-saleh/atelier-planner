# Atelier Interaction Overhaul — Design Spec

**Date:** 2026-06-16
**Status:** Approved
**Approach:** Interaction Primitives Layer (Framer Motion)

## Goal

Transform Atelier from a static classical planner into an interactive, polished daily routine app that feels alive. Preserve the warm cream/gold classical aesthetic while adding modern interaction patterns: page transitions, gestures, drag-reorder, animated data viz, keyboard shortcuts, and achievement celebrations.

## Constraints

- **Keep the classical aesthetic** — cream backgrounds, gold accent, serif headings, paper texture. No visual redesign.
- **Use Framer Motion** as the animation library (~30KB gzipped).
- **Maintain accessibility** — all interactions must work with keyboard, screen readers, and `prefers-reduced-motion`.
- **No new routes or features** — this is purely an interaction/UX polish pass.
- **Local-first data unchanged** — localStorage architecture stays as-is.

## Architecture: Motion Primitives

Create `components/motion/` directory with reusable primitives:

### 1. `AnimatedPage` (`components/motion/AnimatedPage.tsx`)

Wraps page content for route transitions.

```tsx
// Props: children, className
// Uses: motion.div with AnimatePresence context
// Enter: opacity 0→1, y 8→0, 0.3s ease-out
// Exit: opacity 1→0, y 0→8, 0.2s ease-out
// Respects prefers-reduced-motion (no animation)
```

**Integration:** Wrap `<main>` content in `(app)/app/layout.tsx` and `(marketing)/layout.tsx` with `AnimatePresence` + use `AnimatedPage` in each page component.

### 2. `AnimatedList` (`components/motion/AnimateList.tsx`)

Animated list container for task lists, habit lists, journal entries.

```tsx
// Props: items, renderItem, keyExtractor, className
// Uses: AnimatePresence + motion.div with layout prop
// Add: item fades in + slides up (opacity, y, 0.3s)
// Remove: item fades out + slides up (opacity, y, 0.2s)
// Reorder: items animate to new positions with layout animation
```

**Integration:** Replace static `<ul>` / `<ol>` in `TaskList`, `HabitList`, `JournalView`.

### 3. `SwipeableItem` (`components/motion/SwipeableItem.tsx`)

Swipe-left-to-delete / swipe-right-to-complete on mobile.

```tsx
// Props: children, onSwipeLeft, onSwipeRight, leftAction, rightAction
// Uses: motion.div with drag="x", dragConstraints, dragElastic
// Swipe left past -80px threshold: reveals red delete zone
// Swipe right past 80px threshold: reveals green complete zone
// Release: springs back or triggers action
// On desktop: shows drag handle on hover instead of swipe
```

**Integration:** Wrap `TaskItem` and `HabitItem`.

### 4. `DraggableList` (`components/motion/DraggableList.tsx`)

Drag-to-reorder within time slots.

```tsx
// Props: items, onReorder, renderItem, keyExtractor
// Uses: Reorder.Group + Reorder.Item from framer-motion
// Drag handle appears on hover (desktop) or long-press (mobile)
// Items animate to new positions with spring physics
// Updates task order in localStorage
```

**Integration:** Replace static task list in Today page for reorderable time slots.

### 5. `HoverCard` (`components/motion/HoverCard.tsx`)

Cards with subtle lift on hover.

```tsx
// Props: children, className, onClick
// Uses: motion.div
// whileHover: y -2, boxShadow increases (level 2→3)
// whileTap: scale 0.98
// transition: spring (stiffness 300, damping 25)
```

**Integration:** Feature grid cards on marketing page, task cards, habit cards, journal cards.

### 6. `AnimatedButton` (`components/motion/AnimatedButton.tsx`)

Buttons with press feedback.

```tsx
// Props: children, variant, size, onClick, disabled, className
// Uses: motion.button
// whileTap: scale 0.97
// whileHover: brightness shift (subtle)
// transition: spring (stiffness 400, damping 25)
// Preserves existing Button variants (primary/secondary/ghost/danger)
```

**Integration:** Replace `Button` component or wrap it. Apply to all CTA buttons.

### 7. `CelebrationToast` (`components/motion/CelebrationToast.tsx`)

Confetti + toast for streaks and milestones.

```tsx
// Props: show, message, type (streak|complete|best), onClose
// Uses: AnimatePresence + motion.div
// Toast slides in from bottom-right with spring
// Confetti particles (8-12 small squares) burst upward
// Auto-dismiss after 4 seconds
// Respects prefers-reduced-motion (no confetti, toast only)
```

**Integration:** Trigger from habit completion, timer completion, daily task completion.

### 8. `AnimatedProgress` (`components/motion/AnimatedProgress.tsx`)

Progress rings/bars with spring animation.

```tsx
// Props: value (0-100), size, strokeWidth, color
// Uses: useSpring + useMotionValue from framer-motion
// Animates stroke-dashoffset from full to target value
// Spring: stiffness 80, damping 20
// On mount: animates from 0 to current value
```

**Integration:** Replace CSS transition in `ProgressRing`, apply to `WeeklyChart` bars.

## Page Transitions

**Implementation:**

1. Add `AnimatePresence` wrapper in `app/(app)/app/layout.tsx` around `{children}`
2. Add `AnimatePresence` wrapper in `app/(marketing)/layout.tsx` around `{children}`
3. Each page component wraps its content in `<AnimatedPage>`
4. Transition triggers on pathname change via `usePathname()`

**Transition spec:**
- Enter: `opacity: 0 → 1`, `y: 8px → 0px`, `duration: 0.3s`, `ease: easeOut`
- Exit: `opacity: 1 → 0`, `y: 0px → 8px`, `duration: 0.2s`, `ease: easeIn`
- Shared layout: no animation (prevents layout thrash)

**Reduced motion:** When `prefers-reduced-motion: reduce`, transitions are instant (no animation).

## Gestures & Drag

### Task Swipe Actions

| Gesture | Action | Visual Feedback |
|---|---|---|
| Swipe left > 80px | Delete task (with confirm) | Red background with trash icon |
| Swipe left < 80px | Spring back | Subtle rubber-band |
| Swipe right > 80px | Toggle completion | Green background with check icon |
| Swipe right < 80px | Spring back | Subtle rubber-band |

**Desktop alternative:** Drag handle icon appears on hover (left side). Click handle to reorder. Hover reveals edit/delete buttons (existing behavior preserved).

### Habit Swipe Actions

| Gesture | Action | Visual Feedback |
|---|---|---|
| Swipe left > 80px | Archive habit | Gray background with archive icon |
| Swipe right > 80px | Toggle today's completion | Green/check if incomplete, gold/check if complete |

### Pull-to-Refresh (Mobile)

- On overscroll at top of page, show a subtle loading spinner
- Trigger data re-sync if authenticated
- Visual: small spinner fades in at top, spins, fades out

## Data Visualization Motion

### Progress Rings (`ProgressRing`)

- **Mount animation:** Ring fills from 0 to value with spring physics
- **Update animation:** Smooth transition to new value
- **Spring config:** stiffness: 80, damping: 20

### Weekly Chart (`WeeklyChart`)

- **Mount animation:** Bars grow from bottom with stagger
- **Stagger delay:** 50ms per bar (7 bars = 350ms total)
- **Each bar:** `scaleY: 0 → 1`, `transformOrigin: bottom`
- **Duration:** 0.4s ease-out per bar

### Habit Heatmap (`HabitHeatmap`)

- **Mount animation:** Cells fade in sequentially
- **Stagger:** 10ms per cell, row by row
- **Each cell:** `opacity: 0 → 1`, `scale: 0.8 → 1`

### Streak Counter (`StreakLeaderboard`)

- **Update animation:** Number ticks up/down with spring
- **Implementation:** `useSpring` with `Math.round()` for integer display
- **Duration:** 0.6s spring

### Task Completion

- **Toggle complete:** Task text gets subtle strike-through animation
- **Implementation:** Width of strike-through line animates from 0% to 100%
- **Color:** Text fades to `--fg-muted` over 0.3s

## Touch & Hover Polish

### All Buttons

```tsx
whileTap={{ scale: 0.97 }}
transition={{ type: "spring", stiffness: 400, damping: 25 }}
```

### Cards (Feature grid, Task, Habit, Journal)

```tsx
whileHover={{ y: -2, boxShadow: "var(--shadow-card)" }}
whileTap={{ scale: 0.98 }}
transition={{ type: "spring", stiffness: 300, damping: 25 }}
```

### Nav Items

- Active indicator (gold dot) animates position with `layoutId="nav-active"`
- Smooth slide when switching between nav items

### Mood Selector

- Selected mood: `scale: 1.15` with spring bounce
- Unselected: `scale: 1`
- Transition: `type: "spring", stiffness: 500, damping: 15`

### Toggle Switch

- Knob: `x: 0 → 24` with spring instead of CSS transition
- Spring: `stiffness: 500, damping: 30`

### Input Focus

- Border color transitions smoothly via CSS `transition: border-color 0.2s`
- Focus ring: `box-shadow` animates in with `0.2s ease`

## Keyboard Shortcuts

### Implementation

Create `components/motion/KeyboardShortcuts.tsx`:
- Global `keydown` listener (with `useEffect`)
- Ignore when focus is in `<input>`, `<textarea>`, `<select>`, or contentEditable
- Shortcut map object for easy configuration

### Shortcut Table

| Key | Action | Page |
|---|---|---|
| `n` | Open new task form | Today |
| `h` | Open new habit form | Habits |
| `j` | Focus journal editor | Today |
| `t` | Start/pause timer | Timer |
| `?` | Toggle shortcut overlay | Any |
| `Escape` | Close modal/cancel | Any |
| `1` | Navigate to Today | Any |
| `2` | Navigate to Habits | Any |
| `3` | Navigate to Timer | Any |
| `4` | Navigate to Journal | Any |
| `5` | Navigate to Stats | Any |
| `6` | Navigate to Projects | Any |
| `7` | Navigate to Settings | Any |

### Shortcut Overlay

- Triggered by `?` key
- Modal with two-column layout
- Lists all shortcuts with key + description
- Styled with classical aesthetic (cream bg, gold accent)
- Dismissible with Escape or click outside

## Achievement Celebrations

### Streak Milestones

| Milestone | Trigger | Celebration |
|---|---|---|
| 7-day streak | Habit reaches 7 consecutive days | Confetti burst + toast "7-day streak!" |
| 30-day streak | Habit reaches 30 consecutive days | Larger confetti + toast "30-day streak!" |
| 100-day streak | Habit reaches 100 consecutive days | Grand confetti + toast "100-day streak!" |

### Daily Completion

- **All tasks complete:** Gold shimmer animation on progress ring + toast "Day complete!"
- **All habits complete:** Secondary toast "All habits done!"
- **Both:** Combined celebration

### Timer Session

- **Session complete:** Brief screen-edge glow (gold border pulse) + toast "Focus session complete"
- **4 sessions (long break):** Special toast "Time for a long break!"

### Personal Best

- **New best streak:** Toast with animated counter showing the new number
- **Comparison:** "New personal best! 15 days (was 12)"

### Confetti Implementation

- 8-12 small squares (gold, cream, sage colors)
- Burst upward from center with random x-velocity
- Gravity pulls them down
- Fade out after 1.5s
- Respects `prefers-reduced-motion` (no particles, toast only)

## Reduced Motion

All animations respect `prefers-reduced-motion: reduce`:
- Page transitions: instant (no animation)
- List animations: instant add/remove
- Swipe gestures: tap-to-reveal actions instead
- Progress rings: show final value immediately
- Confetti: disabled, toast only
- Hover effects: disabled
- Keyboard shortcuts: still functional

## Files to Create

| File | Purpose |
|---|---|
| `components/motion/AnimatedPage.tsx` | Page transition wrapper |
| `components/motion/AnimatedList.tsx` | Animated list container |
| `components/motion/SwipeableItem.tsx` | Swipe gesture wrapper |
| `components/motion/DraggableList.tsx` | Drag-to-reorder list |
| `components/motion/HoverCard.tsx` | Hover-lift card wrapper |
| `components/motion/AnimatedButton.tsx` | Press-feedback button |
| `components/motion/CelebrationToast.tsx` | Achievement celebration toast |
| `components/motion/AnimatedProgress.tsx` | Animated progress ring/bar |
| `components/motion/KeyboardShortcuts.tsx` | Global keyboard shortcut handler |
| `components/motion/ShortcutOverlay.tsx` | Shortcut reference modal |
| `components/motion/index.ts` | Barrel export |

## Files to Modify

| File | Changes |
|---|---|
| `app/(app)/app/layout.tsx` | Add `AnimatePresence` wrapper, mount `KeyboardShortcuts` |
| `app/(marketing)/layout.tsx` | Add `AnimatePresence` wrapper |
| `app/(app)/app/page.tsx` | Wrap in `AnimatedPage`, use `AnimatedList` for tasks/habits |
| `app/(app)/habits/page.tsx` | Wrap in `AnimatedPage`, use `AnimatedList` |
| `app/(app)/timer/page.tsx` | Wrap in `AnimatedPage` |
| `app/(app)/journal/page.tsx` | Wrap in `AnimatedPage` |
| `app/(app)/stats/page.tsx` | Wrap in `AnimatedPage`, use `AnimatedProgress` |
| `app/(app)/settings/page.tsx` | Wrap in `AnimatedPage` |
| `app/(app)/projects/page.tsx` | Wrap in `AnimatedPage` |
| `components/tasks/TaskItem.tsx` | Wrap in `SwipeableItem`, add completion animation |
| `components/tasks/TaskList.tsx` | Use `AnimatedList` |
| `components/habits/HabitItem.tsx` | Wrap in `SwipeableItem` |
| `components/habits/HabitList.tsx` | Use `AnimatedList` |
| `components/ui/Button.tsx` | Add `whileTap` animation |
| `components/ui/ProgressRing.tsx` | Replace CSS transition with `AnimatedProgress` |
| `components/stats/WeeklyChart.tsx` | Add staggered bar animation |
| `components/stats/HabitHeatmap.tsx` | Add cell fade-in animation |
| `components/stats/StreakLeaderboard.tsx` | Add counter spring animation |
| `components/layout/Sidebar.tsx` | Add `layoutId` for active indicator |
| `app/globals.css` | Add `@media (prefers-reduced-motion)` overrides |

## Dependencies to Add

```bash
npm install framer-motion
```

## Success Criteria

1. Page transitions feel smooth and intentional (no jank, no layout shift)
2. Swipe gestures work reliably on mobile (iOS Safari, Chrome Android)
3. Drag-to-reorder persists order to localStorage
4. All animations respect `prefers-reduced-motion`
5. Keyboard shortcuts work and don't conflict with browser shortcuts
6. Celebration toasts fire at correct milestones
7. No performance regression (Lighthouse score maintained)
8. All existing functionality preserved
