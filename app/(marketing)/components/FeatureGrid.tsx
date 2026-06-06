import {
  BookHeart,
  CalendarCheck,
  Flame,
  LineChart,
  Smartphone,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: CalendarCheck,
    title: "Time-blocked tasks",
    desc: "Plan each day with a time and a duration. See your day at a glance, not buried in a list.",
    color: "dusty",
  },
  {
    icon: Flame,
    title: "Habit streaks",
    desc: "Daily, weekdays, or custom. A gentle visual streak that rewards consistency, not intensity.",
    color: "burgundy",
  },
  {
    icon: Timer,
    title: "Pomodoro focus",
    desc: "Configurable focus and break lengths. Match your rhythm, not someone else's.",
    color: "sage",
  },
  {
    icon: BookHeart,
    title: "Mood journal",
    desc: "A short daily entry with a one-tap mood. The point is not to write more — it is to look up.",
    color: "gold",
  },
  {
    icon: LineChart,
    title: "Quiet insights",
    desc: "See your week and month as calm charts. The data is yours. The charts are gentle.",
    color: "ink",
  },
  {
    icon: Smartphone,
    title: "Dark mode + PWA",
    desc: "Install to your home screen. Works offline. Respects your system theme, or set your own.",
    color: "sage",
  },
];

const colorClassMap: Record<string, string> = {
  sage: "bg-sage-50 text-sage-500",
  burgundy: "bg-burgundy-50 text-burgundy-400",
  dusty: "bg-blue-dusty-50 text-blue-dusty-500",
  gold: "bg-gold-50 text-gold-500",
  ink: "bg-ink-100 text-ink-500",
};

export function FeatureGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((f, i) => {
        const Icon = f.icon;
        return (
          <div
            key={i}
            className="group p-6 sm:p-7 rounded-xl border bg-[var(--bg-card)] transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5"
            style={{ borderColor: "var(--border-soft)" }}
          >
            <div
              className={cn(
                "inline-flex h-11 w-11 rounded-lg items-center justify-center mb-4",
                colorClassMap[f.color],
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <h3
              className="font-serif text-lg italic mb-2"
              style={{ color: "var(--fg)" }}
            >
              {f.title}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--fg-soft)" }}
            >
              {f.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
