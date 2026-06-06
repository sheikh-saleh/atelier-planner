import Link from "next/link";
import type { Metadata } from "next";
import { Code, Heart, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Atelier",
  description:
    "Atelier is a daily routine planner built quietly, for people who would rather build than hustle.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Atelier",
    description:
      "A daily routine planner built quietly, for people who would rather build than hustle.",
    type: "website",
  },
};

const values = [
  {
    icon: Sparkles,
    title: "PWA-first",
    desc: "Installs to your home screen like a native app. Works offline. No app store needed.",
  },
  {
    icon: Heart,
    title: "Local-first",
    desc: "Your data lives in your browser by default. Cloud sync is opt-in, not assumed.",
  },
  {
    icon: Code,
    title: "Open source",
    desc: "The code is yours to read, audit, and learn from. No vendor lock-in, ever.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-16 sm:pt-20 pb-16 sm:pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div
            className="font-serif text-[10px] uppercase tracking-[0.3em] mb-3"
            style={{ color: "var(--accent)" }}
          >
            About
          </div>
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl italic tracking-tight leading-[1.1]"
            style={{ color: "var(--fg)" }}
          >
            Built quietly. For people who would rather build than hustle.
          </h1>

          <div
            className="mt-10 space-y-6 text-base sm:text-lg leading-relaxed font-serif"
            style={{ color: "var(--fg-soft)" }}
          >
            <p>
              I built Atelier because every other planner I tried wanted to do
              too much. They wanted to manage my projects, my goals, my
              relationships, my diet. I just wanted to know what to do this
              morning.
            </p>
            <p>
              Atelier is one routine, one day, one practice. It is not a
              database. It is not a productivity system. It is a quiet room you
              visit each morning to write down the day before you live it.
            </p>
            <p>
              The aesthetic is classical on purpose. Cream paper, serif italics,
              gold accents. Things that look like they were made to be kept, not
              screens designed to keep you scrolling.
            </p>
          </div>

          <blockquote
            className="my-12 pl-6 border-l-2"
            style={{ borderColor: "var(--accent)" }}
          >
            <p
              className="font-display text-2xl sm:text-3xl italic leading-snug"
              style={{ color: "var(--fg)" }}
            >
              &ldquo;We are what we repeatedly do. Excellence, then, is not an
              act, but a habit.&rdquo;
            </p>
            <p
              className="mt-3 font-serif text-xs uppercase tracking-[0.2em]"
              style={{ color: "var(--fg-muted)" }}
            >
              — Aristotle
            </p>
          </blockquote>

          <div
            className="space-y-6 text-base sm:text-lg leading-relaxed font-serif"
            style={{ color: "var(--fg-soft)" }}
          >
            <p>
              The app is a Progressive Web App, so it installs to your home
              screen and works offline. Your data lives in your browser by
              default — and only leaves your device if you choose to sign in and
              sync.
            </p>
            <p>
              There are no ads. There is no algorithm. There is no
              &ldquo;engagement.&rdquo; Just a planner that respects your
              attention.
            </p>
          </div>
        </div>
      </section>

      <section
        className="py-12 sm:py-16 border-t"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="p-6 sm:p-7 rounded-xl border"
                  style={{
                    borderColor: "var(--border-soft)",
                    background: "var(--bg-card)",
                  }}
                >
                  <Icon
                    className="h-5 w-5 mb-3"
                    strokeWidth={1.5}
                    style={{ color: "var(--accent)" }}
                  />
                  <h3
                    className="font-serif text-lg italic mb-2"
                    style={{ color: "var(--fg)" }}
                  >
                    {v.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--fg-soft)" }}
                  >
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2
            className="font-display text-4xl sm:text-5xl italic tracking-tight"
            style={{ color: "var(--fg)" }}
          >
            Try it.
          </h2>
          <p
            className="mt-4 text-base sm:text-lg leading-relaxed font-serif"
            style={{ color: "var(--fg-soft)" }}
          >
            No email required. No trial period. Just open and start.
          </p>
          <div className="mt-8">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center h-12 px-7 rounded-md text-sm font-medium tracking-wide bg-ink-500 text-cream-50 hover:bg-ink-400 dark:bg-cream-100 dark:text-ink-500 dark:hover:bg-cream-200 transition-colors"
            >
              Start free
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
