import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { EmailCapture } from "../components/EmailCapture";

export const metadata: Metadata = {
  title: "Pricing — Atelier",
  description:
    "Atelier is free forever. Pro is coming — one-time payment for cloud sync, multi-device, and future features.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing — Atelier",
    description: "Free forever. Pro is coming — get notified.",
    type: "website",
  },
};

const tiers = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description:
      "Everything you need to build a daily practice. No trial, no tricks.",
    features: [
      "Unlimited tasks, habits, and journal entries",
      "Pomodoro focus timer",
      "Mood tracking",
      "Beautiful weekly insights and charts",
      "Dark mode + PWA install",
      "Works offline",
      "Local-first: your data stays in your browser",
    ],
    cta: { label: "Start free", href: "/auth" },
    highlighted: false,
    badge: null as string | null,
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "one-time",
    description:
      "Sync across devices and unlock the next chapter of features.",
    features: [
      "Everything in Free",
      "Cloud sync across all your devices",
      "Use Pro on all your devices, forever",
      "Custom themes (coming soon)",
      "Advanced insights and exports (coming soon)",
      "Early access to new features",
      "Direct support from the maker",
    ],
    cta: null,
    highlighted: true,
    badge: "Coming soon",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="pt-16 sm:pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div
            className="font-serif text-[10px] uppercase tracking-[0.3em] mb-3"
            style={{ color: "var(--accent)" }}
          >
            Pricing
          </div>
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl italic tracking-tight"
            style={{ color: "var(--fg)" }}
          >
            Free, with a quiet upgrade.
          </h1>
          <p
            className="mt-5 text-base sm:text-lg leading-relaxed"
            style={{ color: "var(--fg-soft)" }}
          >
            Atelier is free forever. Pro is one-time — no subscriptions, no
            recurring charges.
          </p>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="relative rounded-2xl border p-8 sm:p-10"
                style={{
                  background: "var(--bg-card)",
                  borderColor: tier.highlighted
                    ? "var(--accent)"
                    : "var(--border-soft)",
                  boxShadow: tier.highlighted
                    ? "0 1px 3px rgba(44,42,38,0.05), 0 12px 32px rgba(44,42,38,0.08)"
                    : "0 1px 2px rgba(44,42,38,0.04), 0 4px 12px rgba(44,42,38,0.06)",
                }}
              >
                {tier.badge && (
                  <div
                    className="absolute -top-3 left-8 px-3 py-1 rounded-full text-[10px] font-serif uppercase tracking-[0.2em]"
                    style={{ background: "var(--accent)", color: "var(--bg)" }}
                  >
                    {tier.badge}
                  </div>
                )}

                <div
                  className="font-serif text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: "var(--accent)" }}
                >
                  {tier.name}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span
                    className="font-display text-5xl italic"
                    style={{ color: "var(--fg)" }}
                  >
                    {tier.price}
                  </span>
                  <span
                    className="font-serif text-sm italic"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    {tier.cadence}
                  </span>
                </div>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: "var(--fg-soft)" }}
                >
                  {tier.description}
                </p>

                <ul className="mt-7 space-y-3">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm"
                      style={{ color: "var(--fg-soft)" }}
                    >
                      <Check
                        className="h-4 w-4 shrink-0 mt-0.5"
                        strokeWidth={2}
                        style={{ color: "var(--accent)" }}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 relative">
                  {tier.cta ? (
                    <Link
                      href={tier.cta.href}
                      className="inline-flex items-center justify-center h-11 px-5 rounded-md text-sm font-medium tracking-wide w-full bg-ink-500 text-cream-50 hover:bg-ink-400 dark:bg-cream-100 dark:text-ink-500 dark:hover:bg-cream-200 transition-colors"
                    >
                      {tier.cta.label}
                    </Link>
                  ) : (
                    <EmailCapture
                      source="pricing-pro"
                      buttonText="Notify me"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <p
            className="mt-10 text-center text-xs font-serif italic max-w-xl mx-auto"
            style={{ color: "var(--fg-muted)" }}
          >
            All Pro features will roll out as they are built. Early buyers get
            every future Pro update included.
          </p>
        </div>
      </section>
    </>
  );
}
