import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "./components/Hero";
import { FeatureGrid } from "./components/FeatureGrid";
import { ScreenshotCarousel } from "./components/ScreenshotCarousel";
import { FAQ } from "./components/FAQ";
import { LoomEmbed } from "./components/LoomEmbed";
import { EmailCapture } from "./components/EmailCapture";

export const metadata: Metadata = {
  title: "Atelier — A daily routine planner worth keeping",
  description:
    "A classical, minimal daily routine planner with habit tracking, Pomodoro focus, and journaling. Free, offline, and privacy-first. Built for people who would rather build than hustle.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Atelier — A daily routine planner worth keeping",
    description:
      "A classical, minimal daily routine planner. Free, offline, and privacy-first.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <>
      <Hero />

      <section
        id="features"
        className="py-16 sm:py-24 border-t"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <div
              className="font-serif text-[10px] uppercase tracking-[0.3em] mb-3"
              style={{ color: "var(--accent)" }}
            >
              Features
            </div>
            <h2
              className="font-display text-4xl sm:text-5xl italic tracking-tight"
              style={{ color: "var(--fg)" }}
            >
              A small set of tools, used well.
            </h2>
            <p
              className="mt-4 text-base leading-relaxed"
              style={{ color: "var(--fg-soft)" }}
            >
              Other apps will tell you what to do. Atelier reminds you why.
            </p>
          </div>
          <FeatureGrid />
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <div
              className="font-serif text-[10px] uppercase tracking-[0.3em] mb-3"
              style={{ color: "var(--accent)" }}
            >
              A look inside
            </div>
            <h2
              className="font-display text-4xl sm:text-5xl italic tracking-tight"
              style={{ color: "var(--fg)" }}
            >
              Quiet by design.
            </h2>
            <p
              className="mt-4 text-base leading-relaxed"
              style={{ color: "var(--fg-soft)" }}
            >
              No badges, no streaks screaming at you, no streaks at all the
              wrong kind of motivating.
            </p>
          </div>
          <ScreenshotCarousel />
        </div>
      </section>

      <section
        id="demo"
        className="py-16 sm:py-24 border-t"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div
              className="font-serif text-[10px] uppercase tracking-[0.3em] mb-3"
              style={{ color: "var(--accent)" }}
            >
              See it in motion
            </div>
            <h2
              className="font-display text-4xl sm:text-5xl italic tracking-tight"
              style={{ color: "var(--fg)" }}
            >
              Thirty seconds.
            </h2>
          </div>
          <LoomEmbed url={process.env.NEXT_PUBLIC_LOOM_URL} />
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div
            className="font-serif text-[10px] uppercase tracking-[0.3em] mb-3"
            style={{ color: "var(--accent)" }}
          >
            Stay close
          </div>
          <h2
            className="font-display text-4xl sm:text-5xl italic tracking-tight"
            style={{ color: "var(--fg)" }}
          >
            Pro is coming.
          </h2>
          <p
            className="mt-4 text-base leading-relaxed"
            style={{ color: "var(--fg-soft)" }}
          >
            Cloud sync, multi-device, and the next chapter of features. Get
            notified the day it drops — no spam, ever.
          </p>
          <div className="mt-8 max-w-md mx-auto relative">
            <EmailCapture source="landing-cta" buttonText="Notify me" />
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="py-16 sm:py-24 border-t"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <div
              className="font-serif text-[10px] uppercase tracking-[0.3em] mb-3"
              style={{ color: "var(--accent)" }}
            >
              FAQ
            </div>
            <h2
              className="font-display text-4xl sm:text-5xl italic tracking-tight"
              style={{ color: "var(--fg)" }}
            >
              Questions, considered.
            </h2>
          </div>
          <FAQ />
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2
            className="font-display text-4xl sm:text-5xl italic tracking-tight"
            style={{ color: "var(--fg)" }}
          >
            Begin quietly.
          </h2>
          <p
            className="mt-4 text-base leading-relaxed"
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
