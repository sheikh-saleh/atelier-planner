"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PhoneFrame } from "./PhoneFrame";
import { cn } from "@/lib/utils";

const screenshots = [
  { src: "/screenshots/today.png", alt: "Today page with progress rings, tasks, habits, and journal" },
  { src: "/screenshots/habits.png", alt: "Habit tracking with streaks and calendar view" },
  { src: "/screenshots/timer.png", alt: "Pomodoro focus timer with progress ring" },
  { src: "/screenshots/journal.png", alt: "Daily journal with mood tracking" },
  { src: "/screenshots/stats.png", alt: "Insights and statistics with weekly charts" },
];

export function ScreenshotCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const first = el.firstElementChild as HTMLElement | null;
    const itemWidth = first ? first.offsetWidth + 24 : 320;
    el.scrollBy({
      left: dir === "left" ? -itemWidth : itemWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 -mx-6 px-6 lg:mx-0 lg:px-0 no-scrollbar"
      >
        {screenshots.map((s, i) => (
          <div key={i} className="shrink-0 snap-center w-[260px] sm:w-[280px]">
            <PhoneFrame src={s.src} alt={s.alt} />
            <p
              className="mt-4 text-center text-xs font-serif italic px-2"
              style={{ color: "var(--fg-muted)" }}
            >
              {s.alt}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("left")}
        className={cn(
          "hidden lg:flex absolute -left-5 top-[260px] h-10 w-10 rounded-full items-center justify-center bg-[var(--bg-card)] border shadow-soft hover:bg-cream-200 dark:hover:bg-ink-400 transition-colors",
        )}
        style={{ borderColor: "var(--border-soft)" }}
        aria-label="Previous screenshot"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => scroll("right")}
        className={cn(
          "hidden lg:flex absolute -right-5 top-[260px] h-10 w-10 rounded-full items-center justify-center bg-[var(--bg-card)] border shadow-soft hover:bg-cream-200 dark:hover:bg-ink-400 transition-colors",
        )}
        style={{ borderColor: "var(--border-soft)" }}
        aria-label="Next screenshot"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
