"use client";

import { useEffect, useRef, useState } from "react";
import { useData } from "@/components/providers/DataProvider";
import { Label, Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function PomodoroSettings() {
  const { data, setPomodoroConfig } = useData();
  const { focusMin, shortMin, longMin, cyclesUntilLong } = data.settings.pomodoro;

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
    </Card>
  );
}
