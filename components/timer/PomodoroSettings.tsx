"use client";

import { useEffect, useRef, useState } from "react";
import { useData } from "@/components/providers/DataProvider";
import { Label, Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function PomodoroSettings() {
  const { data, setPomodoroConfig } = useData();
  const { focusMin, shortMin, longMin, cyclesUntilLong, autoStartBreaks, autoStartFocus } = data.settings.pomodoro;

  const [draft, setDraft] = useState({ focusMin, shortMin, longMin, cyclesUntilLong });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDraft({ focusMin, shortMin, longMin, cyclesUntilLong });
  }, [focusMin, shortMin, longMin, cyclesUntilLong]);

  useEffect(() => {
    if (
      draft.focusMin === focusMin &&
      draft.shortMin === shortMin &&
      draft.longMin === longMin &&
      draft.cyclesUntilLong === cyclesUntilLong
    ) {
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const clean = (n: number, min: number, max: number) => {
        if (!Number.isFinite(n)) return min;
        return Math.max(min, Math.min(max, n));
      };
      setPomodoroConfig({
        focusMin: clean(draft.focusMin, 1, 120),
        shortMin: clean(draft.shortMin, 1, 60),
        longMin: clean(draft.longMin, 1, 60),
        cyclesUntilLong: clean(draft.cyclesUntilLong, 1, 10),
      });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [draft, focusMin, shortMin, longMin, cyclesUntilLong, setPomodoroConfig]);

  const update = (key: keyof typeof draft) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDraft((d) => ({ ...d, [key]: raw === "" ? 0 : Number.parseInt(raw, 10) }));
  };

  const handleToggleAutoStartBreaks = (checked: boolean) => {
    setPomodoroConfig({ autoStartBreaks: checked });
  };

  const handleToggleAutoStartFocus = (checked: boolean) => {
    setPomodoroConfig({ autoStartFocus: checked });
  };

  return (
    <Card>
      <div className="font-serif text-[11px] uppercase tracking-[0.25em] text-[var(--fg-soft)] mb-3">
        Customize
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="pomodoro-focus">Focus</Label>
          <Input
            id="pomodoro-focus"
            type="number"
            min={1}
            max={120}
            value={draft.focusMin || ""}
            onChange={update("focusMin")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pomodoro-short">Short Break</Label>
          <Input
            id="pomodoro-short"
            type="number"
            min={1}
            max={60}
            value={draft.shortMin || ""}
            onChange={update("shortMin")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pomodoro-long">Long Break</Label>
          <Input
            id="pomodoro-long"
            type="number"
            min={1}
            max={60}
            value={draft.longMin || ""}
            onChange={update("longMin")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pomodoro-cycles">Cycles to Long</Label>
          <Input
            id="pomodoro-cycles"
            type="number"
            min={1}
            max={10}
            value={draft.cyclesUntilLong || ""}
            onChange={update("cyclesUntilLong")}
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--border-soft)] space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="text-sm font-medium">Auto-start Breaks</div>
            <div className="text-xs text-[var(--fg-soft)]">Start break session automatically</div>
          </div>
          <label className="relative inline-flex h-6 w-11 cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={!!autoStartBreaks}
              onChange={(e) => handleToggleAutoStartBreaks(e.target.checked)}
            />
            <span
              className="absolute inset-0 rounded-full transition-colors animate-[fade-in_0.2s]"
              style={{ background: autoStartBreaks ? "var(--accent)" : "var(--border)" }}
            />
            <span
              className="absolute h-4 w-4 rounded-full bg-cream-50 transition-transform duration-200"
              style={{ transform: autoStartBreaks ? "translateX(24px)" : "translateX(4px)" }}
            />
          </label>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="text-sm font-medium">Auto-start Focus</div>
            <div className="text-xs text-[var(--fg-soft)]">Start next focus cycle automatically</div>
          </div>
          <label className="relative inline-flex h-6 w-11 cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={!!autoStartFocus}
              onChange={(e) => handleToggleAutoStartFocus(e.target.checked)}
            />
            <span
              className="absolute inset-0 rounded-full transition-colors animate-[fade-in_0.2s]"
              style={{ background: autoStartFocus ? "var(--accent)" : "var(--border)" }}
            />
            <span
              className="absolute h-4 w-4 rounded-full bg-cream-50 transition-transform duration-200"
              style={{ transform: autoStartFocus ? "translateX(24px)" : "translateX(4px)" }}
            />
          </label>
        </div>
      </div>
    </Card>
  );
}
