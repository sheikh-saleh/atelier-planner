import Link from "next/link";
import { ChevronRight, Play } from "lucide-react";
import { PhoneFrame } from "./PhoneFrame";

export function Hero() {
  return (
    <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span
                className="font-serif text-[10px] uppercase tracking-[0.25em]"
                style={{ color: "var(--accent)" }}
              >
                New · PWA · Works offline
              </span>
            </div>

            <h1
              className="font-display text-5xl sm:text-6xl lg:text-7xl italic leading-[1.05] tracking-tight"
              style={{ color: "var(--fg)" }}
            >
              Discipline,
              <br />
              <span style={{ color: "var(--accent)" }}>repeated.</span>
            </h1>

            <p
              className="mt-6 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
              style={{ color: "var(--fg-soft)" }}
            >
              A classical, minimal daily routine planner for the people who
              want to build the life — not just plan it.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center h-12 px-6 rounded-md text-sm font-medium tracking-wide bg-ink-500 text-cream-50 hover:bg-ink-400 dark:bg-cream-100 dark:text-ink-500 dark:hover:bg-cream-200 transition-colors gap-2 w-full sm:w-auto"
              >
                Start free
                <ChevronRight className="h-4 w-4" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center h-12 px-6 rounded-md text-sm font-medium tracking-wide border hover:bg-cream-200 dark:hover:bg-ink-400 transition-colors gap-2 w-full sm:w-auto"
                style={{ borderColor: "var(--border)" }}
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Watch demo
              </a>
            </div>

            <div
              className="mt-8 flex items-center gap-5 justify-center lg:justify-start text-xs font-serif"
              style={{ color: "var(--fg-muted)" }}
            >
              <span className="flex items-center gap-1.5">
                <span style={{ color: "var(--accent)" }}>✓</span> Free forever
              </span>
              <span className="flex items-center gap-1.5">
                <span style={{ color: "var(--accent)" }}>✓</span> No ads
              </span>
              <span className="flex items-center gap-1.5">
                <span style={{ color: "var(--accent)" }}>✓</span> Privacy first
              </span>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <PhoneFrame
              src="/screenshots/today.png"
              alt="Atelier daily planner app"
              tilt="left"
              className="w-[260px] sm:w-[300px] lg:w-[320px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
