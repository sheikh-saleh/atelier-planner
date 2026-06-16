# Atelier Interaction Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Framer Motion-powered interactions to Atelier — page transitions, gestures, animated data viz, keyboard shortcuts, and achievement celebrations — while preserving the classical cream/gold aesthetic.

**Architecture:** Create a `components/motion/` directory with 10 reusable motion primitives (AnimatedPage, AnimatedList, SwipeableItem, DraggableList, HoverCard, AnimatedButton, CelebrationToast, AnimatedProgress, KeyboardShortcuts, ShortcutOverlay). Wrap existing components with these primitives. Add `AnimatePresence` to layouts for page transitions.

**Tech Stack:** Framer Motion (new dependency), React 18, Next.js 14.2.5, Tailwind 3.4.6

---

## File Map

### Create (11 files)
| File | Purpose |
|---|---|
| `components/motion/AnimatedPage.tsx` | Page transition wrapper |
| `components/motion/AnimatedList.tsx` | Animated list container |
| `components/motion/SwipeableItem.tsx` | Swipe gesture wrapper |
| `components/motion/DraggableList.tsx` | Drag-to-reorder list |
| `components/motion/HoverCard.tsx` | Hover-lift card wrapper |
| `components/motion/AnimatedButton.tsx` | Press-feedback button |
| `components/motion/CelebrationToast.tsx` | Achievement celebration toast |
| `components/motion/AnimatedProgress.tsx` | Animated progress ring |
| `components/motion/KeyboardShortcuts.tsx` | Global keyboard shortcut handler |
| `components/motion/ShortcutOverlay.tsx` | Shortcut reference modal |
| `components/motion/index.ts` | Barrel export |

### Modify (16 files)
| File | Changes |
|---|---|
| `package.json` | Add framer-motion dependency |
| `app/layout.tsx` | Add `LazyMotion` provider wrapper |
| `app/(marketing)/layout.tsx` | Add `AnimatePresence` + `AnimatedPage` |
| `app/globals.css` | Add `prefers-reduced-motion` overrides |
| `app/app/page.tsx` | Wrap in `AnimatedPage`, use `AnimatedList` |
| `app/app/habits/page.tsx` | Wrap in `AnimatedPage`, use `AnimatedList` |
| `app/app/timer/page.tsx` | Wrap in `AnimatedPage` |
| `app/app/journal/page.tsx` | Wrap in `AnimatedPage` |
| `app/app/stats/page.tsx` | Wrap in `AnimatedPage`, use `AnimatedProgress` |
| `app/app/settings/page.tsx` | Wrap in `AnimatedPage` |
| `app/app/projects/page.tsx` | Wrap in `AnimatedPage` |
| `components/tasks/TaskItem.tsx` | Wrap in `SwipeableItem`, add completion animation |
| `components/tasks/TaskList.tsx` | Use `AnimatedList` |
| `components/habits/HabitItem.tsx` | Wrap in `SwipeableItem` |
| `components/habits/HabitList.tsx` | Use `AnimatedList` |
| `components/ui/ProgressRing.tsx` | Replace CSS transition with `AnimatedProgress` |
| `components/layout/Sidebar.tsx` | Add `layoutId` for active indicator |
| `components/stats/HabitHeatmap.tsx` | Add cell fade-in animation |
| `components/stats/StreakLeaderboard.tsx` | Add counter spring animation |

---

## Task 1: Install Framer Motion

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install framer-motion**

```bash
npm install framer-motion
```

- [ ] **Step 2: Verify installation**

```bash
npm ls framer-motion
```

Expected: `framer-motion@12.x.x` listed

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add framer-motion"
```

---

## Task 2: Add Reduced Motion CSS

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add prefers-reduced-motion block at end of globals.css**

Append to `app/globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Verify no syntax errors**

Run: `npm run build 2>&1 | head -20`
Expected: Build starts without CSS errors

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: add prefers-reduced-motion overrides"
```

---

## Task 3: Create AnimatedPage Primitive

**Files:**
- Create: `components/motion/AnimatedPage.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};

const pageTransition = {
  type: "tween" as const,
  ease: "easeOut",
  duration: 0.3,
};

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/AnimatedPage.tsx
git commit -m "feat(motion): add AnimatedPage primitive"
```

---

## Task 4: Create AnimatedList Primitive

**Files:**
- Create: `components/motion/AnimatedList.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedListProps<T> {
  items: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  itemClassName?: string;
}

const itemVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export function AnimatedList<T>({
  items,
  keyExtractor,
  renderItem,
  className,
  itemClassName,
}: AnimatedListProps<T>) {
  return (
    <div className={className}>
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={keyExtractor(item, index)}
            variants={itemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
            layout
            className={itemClassName}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/AnimatedList.tsx
git commit -m "feat(motion): add AnimatedList primitive"
```

---

## Task 5: Create SwipeableItem Primitive

**Files:**
- Create: `components/motion/SwipeableItem.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import type { ReactNode } from "react";

interface SwipeableItemProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftLabel?: string;
  rightLabel?: string;
  leftColor?: string;
  rightColor?: string;
  threshold?: number;
}

export function SwipeableItem({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftLabel = "Delete",
  rightLabel = "Complete",
  leftColor = "var(--burgundy-300)",
  rightColor = "var(--sage-400)",
  threshold = 80,
}: SwipeableItemProps) {
  const x = useMotionValue(0);
  const leftBg = useTransform(x, [-threshold * 2, -threshold], [leftColor, leftColor]);
  const rightBg = useTransform(x, [threshold, threshold * 2], [rightColor, rightColor]);
  const leftOpacity = useTransform(x, [-threshold * 2, -threshold], [1, 0.8]);
  const rightOpacity = useTransform(x, [threshold, threshold * 2], [0.8, 1]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x < -threshold && onSwipeLeft) {
      onSwipeLeft();
    } else if (info.offset.x > threshold && onSwipeRight) {
      onSwipeRight();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Left action (delete) */}
      {onSwipeLeft && (
        <motion.div
          className="absolute inset-y-0 left-0 flex items-center pl-4 text-cream-50 text-xs font-medium rounded-l-lg"
          style={{ backgroundColor: leftBg, opacity: leftOpacity, width: "100px" }}
        >
          {leftLabel}
        </motion.div>
      )}

      {/* Right action (complete) */}
      {onSwipeRight && (
        <motion.div
          className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 text-cream-50 text-xs font-medium rounded-r-lg"
          style={{ backgroundColor: rightBg, opacity: rightOpacity, width: "100px" }}
        >
          {rightLabel}
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        style={{ x }}
        drag={onSwipeLeft || onSwipeRight ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        className="relative z-10 bg-[var(--bg-card)]"
      >
        {children}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/SwipeableItem.tsx
git commit -m "feat(motion): add SwipeableItem primitive"
```

---

## Task 6: Create DraggableList Primitive

**Files:**
- Create: `components/motion/DraggableList.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { Reorder, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface DraggableListProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  className?: string;
  itemClassName?: string;
}

export function DraggableList<T>({
  items,
  onReorder,
  keyExtractor,
  renderItem,
  className,
  itemClassName,
}: DraggableListProps<T>) {
  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={onReorder}
      className={className}
    >
      <AnimatePresence>
        {items.map((item) => (
          <Reorder.Item
            key={keyExtractor(item)}
            value={item}
            className={itemClassName}
            whileDrag={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
          >
            {renderItem(item)}
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/DraggableList.tsx
git commit -m "feat(motion): add DraggableList primitive"
```

---

## Task 7: Create HoverCard Primitive

**Files:**
- Create: `components/motion/HoverCard.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function HoverCard({ children, className, onClick }: HoverCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={className}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/HoverCard.tsx
git commit -m "feat(motion): add HoverCard primitive"
```

---

## Task 8: Create AnimatedButton Primitive

**Files:**
- Create: `components/motion/AnimatedButton.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ink-500 text-cream-50 hover:bg-ink-400 dark:bg-cream-100 dark:text-ink-500 dark:hover:bg-cream-200",
  secondary:
    "bg-cream-200 text-ink-500 hover:bg-cream-300 dark:bg-ink-400 dark:text-cream-100 dark:hover:bg-ink-300",
  ghost: "bg-transparent text-ink-400 hover:bg-cream-200 dark:text-cream-200 dark:hover:bg-ink-400",
  danger: "bg-burgundy-300 text-cream-50 hover:bg-burgundy-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  function AnimatedButton(
    { className, variant = "secondary", size = "md", type = "button", disabled, ...rest },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-wide",
          "transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
          "border border-transparent",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...rest}
      />
    );
  },
);
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/AnimatedButton.tsx
git commit -m "feat(motion): add AnimatedButton primitive"
```

---

## Task 9: Create CelebrationToast

**Files:**
- Create: `components/motion/CelebrationToast.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CelebrationToastProps {
  show: boolean;
  message: string;
  type?: "streak" | "complete" | "best" | "default";
  onClose: () => void;
  duration?: number;
}

function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 200,
      y: -(Math.random() * 150 + 50),
      rotation: Math.random() * 360,
      color: ["var(--gold-300)", "var(--sage-300)", "var(--cream-300)", "var(--accent)"][i % 4],
      delay: Math.random() * 0.2,
    })),
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 h-2 w-2 rounded-sm"
          style={{ backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            rotate: p.rotation,
            scale: 0.5,
          }}
          transition={{
            duration: 1.5,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

const typeStyles: Record<string, string> = {
  streak: "border-gold-300 bg-gold-50",
  complete: "border-sage-300 bg-sage-50",
  best: "border-burgundy-300 bg-burgundy-50",
  default: "border-[var(--border)] bg-[var(--bg-card)]",
};

export function CelebrationToast({
  show,
  message,
  type = "default",
  onClose,
  duration = 4000,
}: CelebrationToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="relative">
            {(type === "streak" || type === "best") && <Confetti />}
            <div
              className={cn(
                "relative flex items-center gap-3 rounded-lg border px-4 py-3 shadow-soft",
                "font-serif text-sm",
                typeStyles[type],
              )}
            >
              <span>{message}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/CelebrationToast.tsx
git commit -m "feat(motion): add CelebrationToast with confetti"
```

---

## Task 10: Create AnimatedProgress

**Files:**
- Create: `components/motion/AnimatedProgress.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedProgressProps {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  className?: string;
  label?: React.ReactNode;
  trackColor?: string;
  fillColor?: string;
}

export function AnimatedProgress({
  value,
  size = 120,
  stroke = 8,
  className,
  label,
  trackColor,
  fillColor,
}: AnimatedProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useMotionValue(0);
  const springProgress = useSpring(progress, { stiffness: 80, damping: 20 });
  const strokeDashoffset = useTransform(
    springProgress,
    (v) => circumference - (v / 100) * circumference,
  );

  useEffect(() => {
    progress.set(clampedValue);
  }, [clampedValue, progress]);

  return (
    <div className={cn("relative inline-flex w-full h-full items-center justify-center", className)}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        preserveAspectRatio="xMidYMid meet"
        className="-rotate-90 w-full h-full overflow-visible"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor ?? "var(--border)"}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={fillColor ?? "var(--accent)"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{label}</div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/AnimatedProgress.tsx
git commit -m "feat(motion): add AnimatedProgress with spring physics"
```

---

## Task 11: Create KeyboardShortcuts and ShortcutOverlay

**Files:**
- Create: `components/motion/KeyboardShortcuts.tsx`
- Create: `components/motion/ShortcutOverlay.tsx`

- [ ] **Step 1: Create ShortcutOverlay**

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ShortcutOverlayProps {
  show: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: "n", action: "New task" },
  { key: "h", action: "New habit" },
  { key: "j", action: "Journal entry" },
  { key: "t", action: "Start/pause timer" },
  { key: "?", action: "Toggle this overlay" },
  { key: "Esc", action: "Close modal / cancel" },
  { key: "1-7", action: "Navigate to page" },
];

export function ShortcutOverlay({ show, onClose }: ShortcutOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-xl border bg-[var(--bg-card)] p-6 shadow-card"
              style={{ borderColor: "var(--border)" }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              role="dialog"
              aria-label="Keyboard shortcuts"
            >
              <h2 className="font-serif text-lg italic mb-4" style={{ color: "var(--fg)" }}>
                Keyboard Shortcuts
              </h2>
              <div className="space-y-2">
                {shortcuts.map((s) => (
                  <div key={s.key} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "var(--fg-soft)" }}>
                      {s.action}
                    </span>
                    <kbd className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded border text-xs font-mono bg-[var(--bg-soft)]">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
              <button
                onClick={onClose}
                className="mt-4 w-full h-8 rounded-md text-xs font-medium transition-colors hover:bg-[var(--bg-soft)]"
                style={{ color: "var(--fg-soft)" }}
              >
                Close (Esc)
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Create KeyboardShortcuts**

```tsx
"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ShortcutOverlay } from "./ShortcutOverlay";

const pageShortcuts: Record<string, string> = {
  "1": "/app",
  "2": "/app/habits",
  "3": "/app/timer",
  "4": "/app/journal",
  "5": "/app/stats",
  "6": "/app/projects",
  "7": "/app/settings",
};

export function KeyboardShortcuts() {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || target.isContentEditable) {
        return;
      }

      if (e.key === "Escape") {
        setShowOverlay(false);
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setShowOverlay((prev) => !prev);
        return;
      }

      if (e.key in pageShortcuts) {
        e.preventDefault();
        router.push(pageShortcuts[e.key]);
        return;
      }

      // Custom event dispatch for app-specific shortcuts
      const customShortcuts: Record<string, string> = {
        n: "atelier:new-task",
        h: "atelier:new-habit",
        j: "atelier:focus-journal",
        t: "atelier:toggle-timer",
      };

      if (e.key in customShortcuts) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(customShortcuts[e.key]));
      }
    },
    [router],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return <ShortcutOverlay show={showOverlay} onClose={() => setShowOverlay(false)} />;
}
```

- [ ] **Step 3: Commit**

```bash
git add components/motion/KeyboardShortcuts.tsx components/motion/ShortcutOverlay.tsx
git commit -m "feat(motion): add keyboard shortcuts and overlay"
```

---

## Task 12: Create Barrel Export

**Files:**
- Create: `components/motion/index.ts`

- [ ] **Step 1: Create barrel export**

```ts
export { AnimatedPage } from "./AnimatedPage";
export { AnimatedList } from "./AnimatedList";
export { SwipeableItem } from "./SwipeableItem";
export { DraggableList } from "./DraggableList";
export { HoverCard } from "./HoverCard";
export { AnimatedButton } from "./AnimatedButton";
export { CelebrationToast } from "./CelebrationToast";
export { AnimatedProgress } from "./AnimatedProgress";
export { KeyboardShortcuts } from "./KeyboardShortcuts";
export { ShortcutOverlay } from "./ShortcutOverlay";
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/index.ts
git commit -m "feat(motion): add barrel export"
```

---

## Task 13: Add LazyMotion Provider to Root Layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add LazyMotion import and provider**

Open `app/layout.tsx`. Add `import { LazyMotion, domAnimation } from "framer-motion"` at the top. Wrap the return JSX with `<LazyMotion features={domAnimation}>...</LazyMotion>` around the outermost `<html>` content (inside the `<html>` tag, wrapping the body contents).

The root layout currently returns:

```tsx
return (
  <html lang="en" suppressHydrationWarning>
    <body>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>{children}</DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </body>
  </html>
);
```

Change to:

```tsx
import { LazyMotion, domAnimation } from "framer-motion";

// ... in the component:
return (
  <html lang="en" suppressHydrationWarning>
    <body>
      <LazyMotion features={domAnimation}>
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>{children}</DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </LazyMotion>
    </body>
  </html>
);
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -5`
Expected: Build completes without errors

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(motion): add LazyMotion provider to root layout"
```

---

## Task 14: Add KeyboardShortcuts to Root Layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Import and mount KeyboardShortcuts**

In `app/layout.tsx`, add `import { KeyboardShortcuts } from "@/components/motion"` and place `<KeyboardShortcuts />` inside `<DataProvider>` alongside `{children}`:

```tsx
<DataProvider>
  <KeyboardShortcuts />
  {children}
</DataProvider>
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(motion): mount keyboard shortcuts globally"
```

---

## Task 15: Add Page Transitions to App Pages

**Files:**
- Modify: `app/app/page.tsx`
- Modify: `app/app/habits/page.tsx`
- Modify: `app/app/timer/page.tsx`
- Modify: `app/app/journal/page.tsx`
- Modify: `app/app/stats/page.tsx`
- Modify: `app/app/settings/page.tsx`
- Modify: `app/app/projects/page.tsx`

- [ ] **Step 1: Wrap each page in AnimatedPage**

For each page file listed above, add `import { AnimatedPage } from "@/components/motion"` and wrap the return content in `<AnimatedPage>...</AnimatedPage>`.

Example for `app/app/page.tsx` (Today page):

```tsx
import { AnimatedPage } from "@/components/motion";

// In the return, wrap the outermost div:
return (
  <AnimatedPage>
    <div className="...">
      {/* existing content */}
    </div>
  </AnimatedPage>
);
```

Apply the same pattern to all 7 page files.

- [ ] **Step 2: Wrap marketing layout pages**

In `app/(marketing)/layout.tsx`, wrap `{children}` with `AnimatedPage`:

```tsx
import { AnimatedPage } from "@/components/motion";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />
      <main className="flex-1">
        <AnimatedPage>{children}</AnimatedPage>
      </main>
      <MarketingFooter />
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build 2>&1 | tail -5`
Expected: Build completes without errors

- [ ] **Step 4: Commit**

```bash
git add app/app/page.tsx app/app/habits/page.tsx app/app/timer/page.tsx app/app/journal/page.tsx app/app/stats/page.tsx app/app/settings/page.tsx app/app/projects/page.tsx "app/(marketing)/layout.tsx"
git commit -m "feat(motion): add page transitions to all pages"
```

---

## Task 16: Replace Button with AnimatedButton

**Files:**
- Modify: `components/ui/Button.tsx`

- [ ] **Step 1: Update Button to use motion**

Replace the `components/ui/Button.tsx` content to use `motion.button` with `whileTap`:

```tsx
"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { motion } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ink-500 text-cream-50 hover:bg-ink-400 dark:bg-cream-100 dark:text-ink-500 dark:hover:bg-cream-200",
  secondary:
    "bg-cream-200 text-ink-500 hover:bg-cream-300 dark:bg-ink-400 dark:text-cream-100 dark:hover:bg-ink-300",
  ghost: "bg-transparent text-ink-400 hover:bg-cream-200 dark:text-cream-200 dark:hover:bg-ink-400",
  danger: "bg-burgundy-300 text-cream-50 hover:bg-burgundy-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "secondary", size = "md", type = "button", disabled, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-wide",
        "transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
        "border border-transparent",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    />
  );
});
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/Button.tsx
git commit -m "feat(motion): add press animation to Button"
```

---

## Task 17: Replace ProgressRing with AnimatedProgress

**Files:**
- Modify: `components/ui/ProgressRing.tsx`

- [ ] **Step 1: Update ProgressRing to use AnimatedProgress**

Replace `components/ui/ProgressRing.tsx` content:

```tsx
"use client";

import { AnimatedProgress } from "@/components/motion";

export function ProgressRing({
  value,
  size = 120,
  stroke = 8,
  className,
  label,
  trackColor,
  fillColor,
}: {
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  label?: React.ReactNode;
  trackColor?: string;
  fillColor?: string;
}) {
  return (
    <AnimatedProgress
      value={value}
      size={size}
      stroke={stroke}
      className={className}
      label={label}
      trackColor={trackColor}
      fillColor={fillColor}
    />
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -5`
Expected: Build completes

- [ ] **Step 3: Commit**

```bash
git add components/ui/ProgressRing.tsx
git commit -m "feat(motion): animate ProgressRing with spring physics"
```

---

## Task 18: Add Animated List to TaskList

**Files:**
- Modify: `components/tasks/TaskList.tsx`

- [ ] **Step 1: Import AnimatedList**

Add `import { AnimatedList } from "@/components/motion"` at top of `TaskList.tsx`.

- [ ] **Step 2: Wrap task rendering with AnimatedList**

In `TaskList.tsx`, find where tasks are rendered (the `TaskItem` mapping) and wrap with `AnimatedList`. The file renders tasks inside grouped time slots. Replace the `<ul>` or `<div>` that maps over tasks with:

```tsx
<AnimatedList
  items={grouped[slot]}
  keyExtractor={(task) => task.id}
  renderItem={(task) => (
    <TaskItem
      key={task.id}
      task={task}
      onToggle={toggleTask}
      onEdit={(t) => { setEditing(t); setFormOpen(true); }}
      onDelete={deleteTask}
    />
  )}
  className="space-y-2"
  itemClassName=""
/>
```

Apply this pattern to each time slot's task list within the grouped rendering.

- [ ] **Step 3: Commit**

```bash
git add components/tasks/TaskList.tsx
git commit -m "feat(motion): animate task list with AnimatedList"
```

---

## Task 19: Add SwipeableItem to TaskItem

**Files:**
- Modify: `components/tasks/TaskItem.tsx`

- [ ] **Step 1: Import SwipeableItem**

Add `import { SwipeableItem } from "@/components/motion"` and `import { useData } from "@/components/providers/DataProvider"` (if not already imported).

- [ ] **Step 2: Wrap TaskItem content with SwipeableItem**

Wrap the outer `<div>` of `TaskItem`'s return with `<SwipeableItem>`:

```tsx
export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const cat = categoryMap[task.category];
  return (
    <SwipeableItem
      onSwipeLeft={() => onDelete(task.id)}
      onSwipeRight={() => onToggle(task.id)}
      leftLabel="Delete"
      rightLabel="Done"
    >
      <div
        className={cn(
          "group flex items-start gap-3 rounded-lg border p-3.5 transition-all",
          // ... existing classes
        )}
        style={{ borderColor: "var(--border-soft)" }}
      >
        {/* existing content unchanged */}
      </div>
    </SwipeableItem>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/tasks/TaskItem.tsx
git commit -m "feat(motion): add swipe gestures to TaskItem"
```

---

## Task 20: Add SwipeableItem to HabitItem

**Files:**
- Modify: `components/habits/HabitItem.tsx`

- [ ] **Step 1: Import SwipeableItem**

Add `import { SwipeableItem } from "@/components/motion"`.

- [ ] **Step 2: Wrap HabitItem content**

Wrap the outer `<div>` with:

```tsx
<SwipeableItem
  onSwipeLeft={() => onDelete(habit.id)}
  onSwipeRight={() => onToggle(habit.id, date)}
  leftLabel="Archive"
  rightLabel="Done"
>
  <div className="...">
    {/* existing content */}
  </div>
</SwipeableItem>
```

- [ ] **Step 3: Commit**

```bash
git add components/habits/HabitItem.tsx
git commit -m "feat(motion): add swipe gestures to HabitItem"
```

---

## Task 21: Add Animated List to HabitList

**Files:**
- Modify: `components/habits/HabitList.tsx`

- [ ] **Step 1: Import AnimatedList**

Add `import { AnimatedList } from "@/components/motion"`.

- [ ] **Step 2: Wrap habit rendering with AnimatedList**

Replace the `<ul>` mapping habits with `AnimatedList`:

```tsx
<AnimatedList
  items={todayHabits}
  keyExtractor={(h) => h.id}
  renderItem={(h) => (
    <HabitItem
      key={h.id}
      habit={h}
      date={today}
      onToggle={toggleHabitOnDate}
      onEdit={handleEdit}
      onDelete={deleteHabit}
    />
  )}
  className="space-y-2"
/>
```

- [ ] **Step 3: Commit**

```bash
git add components/habits/HabitList.tsx
git commit -m "feat(motion): animate habit list with AnimatedList"
```

---

## Task 22: Add Animated Active Indicator to Sidebar

**Files:**
- Modify: `components/layout/Sidebar.tsx`

- [ ] **Step 1: Import motion**

Add `import { motion } from "framer-motion"`.

- [ ] **Step 2: Replace static gold dot with layoutId-animated indicator**

Find the active indicator `<span>` in the nav items:

```tsx
{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />}
```

Replace with:

```tsx
{active && (
  <motion.span
    layoutId="nav-active"
    className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
  />
)}
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/Sidebar.tsx
git commit -m "feat(motion): animate sidebar active indicator"
```

---

## Task 23: Add Heatmap Cell Animation

**Files:**
- Modify: `components/stats/HabitHeatmap.tsx`

- [ ] **Step 1: Import motion**

Add `import { motion } from "framer-motion"`.

- [ ] **Step 2: Replace static div with motion.div**

Replace the heatmap cell `<div>`:

```tsx
<div
  key={d.toISOString()}
  className="aspect-square rounded"
  style={{ backgroundColor: bg }}
  title={format(d, "MMM d")}
/>
```

With:

```tsx
<motion.div
  key={d.toISOString()}
  className="aspect-square rounded"
  style={{ backgroundColor: bg }}
  title={format(d, "MMM d")}
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: index * 0.01, duration: 0.3 }}
/>
```

This requires capturing the index in the `.map()` callback:

```tsx
{grid.map(({ d, rate }, index) => {
```

- [ ] **Step 3: Commit**

```bash
git add components/stats/HabitHeatmap.tsx
git commit -m "feat(motion): animate heatmap cells with stagger"
```

---

## Task 24: Add Streak Counter Animation

**Files:**
- Modify: `components/stats/StreakLeaderboard.tsx`

- [ ] **Step 1: Import motion**

Add `import { motion } from "framer-motion"`.

- [ ] **Step 2: Wrap streak number with motion**

Replace the streak number display:

```tsx
<div className="text-sm font-medium tnum">{current}</div>
```

With:

```tsx
<motion.div
  className="text-sm font-medium tnum"
  key={current}
  initial={{ opacity: 0, y: -4 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
>
  {current}
</motion.div>
```

- [ ] **Step 3: Commit**

```bash
git add components/stats/StreakLeaderboard.tsx
git commit -m "feat(motion): animate streak counter"
```

---

## Task 25: Add Keyboard Event Listeners to Pages

**Files:**
- Modify: `app/app/page.tsx`
- Modify: `app/app/habits/page.tsx`
- Modify: `app/app/timer/page.tsx`

- [ ] **Step 1: Add keyboard listener to Today page**

In `app/app/page.tsx`, add event listeners for `n` (new task) and `j` (focus journal):

```tsx
"use client";

import { useEffect, useRef } from "react";

// Inside the TodayPage component:
const journalRef = useRef<HTMLTextAreaElement>(null);

useEffect(() => {
  const handleNewTask = () => {
    // Trigger new task form open - dispatch to TaskList
    document.dispatchEvent(new CustomEvent("atelier:open-new-task"));
  };
  const handleFocusJournal = () => {
    journalRef.current?.focus();
  };

  window.addEventListener("atelier:new-task", handleNewTask);
  window.addEventListener("atelier:focus-journal", handleFocusJournal);
  return () => {
    window.removeEventListener("atelier:new-task", handleNewTask);
    window.removeEventListener("atelier:focus-journal", handleFocusJournal);
  };
}, []);
```

- [ ] **Step 2: Add keyboard listener to Habits page**

In `app/app/habits/page.tsx`, add listener for `h` (new habit):

```tsx
useEffect(() => {
  const handleNewHabit = () => {
    document.dispatchEvent(new CustomEvent("atelier:open-new-habit"));
  };
  window.addEventListener("atelier:new-habit", handleNewHabit);
  return () => window.removeEventListener("atelier:new-habit", handleNewHabit);
}, []);
```

- [ ] **Step 3: Add keyboard listener to Timer page**

In `app/app/timer/page.tsx`, add listener for `t` (toggle timer):

```tsx
useEffect(() => {
  const handleToggleTimer = () => {
    document.dispatchEvent(new CustomEvent("atelier:toggle-timer"));
  };
  window.addEventListener("atelier:toggle-timer", handleToggleTimer);
  return () => window.removeEventListener("atelier:toggle-timer", handleToggleTimer);
}, []);
```

- [ ] **Step 4: Commit**

```bash
git add app/app/page.tsx app/app/habits/page.tsx app/app/timer/page.tsx
git commit -m "feat(motion): add keyboard shortcut listeners to pages"
```

---

## Task 26: Final Build Verification

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: Build succeeds with no errors

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No errors or warnings related to new code

- [ ] **Step 3: Manual smoke test**

```bash
npm run dev
```

Open http://localhost:3000 and verify:
- Page transitions animate on route changes
- Buttons have press feedback (scale down on click)
- Progress rings animate on mount
- Tasks/habits can be swiped on mobile
- Press `?` to see keyboard shortcuts overlay
- Press `1`-`7` to navigate between pages
- Heatmap cells fade in on the Stats page
- Streak numbers animate on the Stats page

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Atelier interaction overhaul with Framer Motion"
```
