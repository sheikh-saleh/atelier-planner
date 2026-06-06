import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is Atelier free?",
    a: "Yes. The free tier includes every core feature — tasks, habits, timer, journal — with no time limit and no account required. Your data stays in your browser, not on our servers.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. You can start using Atelier immediately without signing up; everything is saved locally. An account is only useful if you want to sync your data across devices.",
  },
  {
    q: "Does it work offline?",
    a: "Yes. Atelier is a Progressive Web App — install it to your home screen and it works without a connection. Your changes sync the next time you are online.",
  },
  {
    q: "Where is my data stored?",
    a: "By default, in your browser's local storage. Nothing leaves your device unless you sign in, in which case your data is encrypted in transit and stored in our Supabase database. We never sell or share it.",
  },
  {
    q: "How is this different from Notion or Todoist?",
    a: "Atelier is intentionally narrow: one routine, one day, one practice. It does not try to be a database or a team tool. The goal is to make the small daily work feel worth doing, not to manage every corner of your life.",
  },
  {
    q: "Can I export my data?",
    a: "Yes. The Settings panel has a one-click export to JSON. You can also import a previously exported file to restore or migrate.",
  },
];

export function FAQ() {
  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {faqs.map((item, i) => (
        <details
          key={i}
          open={i === 0}
          className="group rounded-lg border bg-[var(--bg-card)] overflow-hidden transition-shadow hover:shadow-soft"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none select-none">
            <span className="font-serif text-base" style={{ color: "var(--fg)" }}>
              {item.q}
            </span>
            <ChevronDown
              className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
              style={{ color: "var(--fg-muted)" }}
            />
          </summary>
          <div className="px-5 pb-5 -mt-1">
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--fg-soft)" }}
            >
              {item.a}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
