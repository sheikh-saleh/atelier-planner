"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useData } from "@/components/providers/DataProvider";
import type { Frequency, Habit } from "@/lib/types";
import { colorMap } from "@/lib/utils";

const ICON_CHOICES = [
  "Activity",
  "BookOpen",
  "Brain",
  "Coffee",
  "Droplet",
  "Dumbbell",
  "Feather",
  "Flame",
  "Heart",
  "Leaf",
  "Moon",
  "Music",
  "Pen",
  "Sparkles",
  "Sun",
  "Target",
  "TreePine",
  "Zap",
];

interface HabitFormProps {
  open: boolean;
  onClose: () => void;
  initial?: Habit;
}

const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

export function HabitForm({ open, onClose, initial }: HabitFormProps) {
  const { addHabit, updateHabit } = useData();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "Activity");
  const [color, setColor] = useState(initial?.color ?? "sage");
  const [frequency, setFrequency] = useState<Frequency>(initial?.frequency ?? "daily");
  const [customDays, setCustomDays] = useState<number[]>(initial?.customDays ?? [1, 2, 3, 4, 5]);

  // Sync state with `initial` prop changes so editing a different habit refreshes the form
  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setIcon(initial?.icon ?? "Activity");
    setColor(initial?.color ?? "sage");
    setFrequency(initial?.frequency ?? "daily");
    setCustomDays(initial?.customDays ?? [1, 2, 3, 4, 5]);
  }, [initial, open]);

  const reset = () => {
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setIcon(initial?.icon ?? "Activity");
    setColor(initial?.color ?? "sage");
    setFrequency(initial?.frequency ?? "daily");
    setCustomDays(initial?.customDays ?? [1, 2, 3, 4, 5]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      icon,
      color,
      frequency,
      customDays: frequency === "custom" ? customDays : undefined,
    };
    if (initial) {
      updateHabit(initial.id, payload);
    } else {
      addHabit(payload);
    }
    reset();
    onClose();
  };

  const toggleDay = (d: number) => {
    setCustomDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()));
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Habit" : "New Habit"} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Read 20 pages" autoFocus required />
        </div>

        <div className="space-y-1.5">
          <Label>Description (optional)</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A small note to remind you why" />
        </div>

        <div className="space-y-1.5">
          <Label>Icon</Label>
          <div className="grid grid-cols-9 gap-1.5">
            {ICON_CHOICES.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIcon(i)}
                className={`h-9 rounded-md border text-[10px] font-mono transition-colors ${
                  icon === i
                    ? "bg-[var(--accent)] text-cream-50 border-[var(--accent)]"
                    : "border-[var(--border-soft)] hover:bg-cream-200 dark:hover:bg-ink-400"
                }`}
              >
                {i.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Color</Label>
          <div className="flex gap-2">
            {Object.keys(colorMap).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${colorMap[c].bg} ${
                  color === c ? "ring-2 ring-offset-2 ring-[var(--accent)]" : "opacity-60 hover:opacity-100"
                }`}
                style={{ "--tw-ring-offset-color": "var(--bg-card)" } as React.CSSProperties}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Frequency</Label>
          <Select
            value={frequency}
            onChange={(v) => setFrequency(v as Frequency)}
            options={[
              { value: "daily", label: "Every day" },
              { value: "weekdays", label: "Weekdays only" },
              { value: "weekends", label: "Weekends only" },
              { value: "custom", label: "Custom days" },
            ]}
          />
        </div>

        {frequency === "custom" && (
          <div className="space-y-1.5">
            <Label>On Days</Label>
            <div className="flex gap-1">
              {dayLabels.map((d, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleDay(idx)}
                  className={`h-9 w-9 rounded-md text-xs font-medium transition-colors ${
                    customDays.includes(idx)
                      ? "bg-[var(--accent)] text-cream-50"
                      : "border border-[var(--border-soft)] hover:bg-cream-200 dark:hover:bg-ink-400"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initial ? "Save" : "Create Habit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
