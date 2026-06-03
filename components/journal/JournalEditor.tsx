"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useData } from "@/components/providers/DataProvider";
import type { JournalEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

const moods = [
  { value: 1, emoji: "😔", label: "Low" },
  { value: 2, emoji: "😕", label: "Off" },
  { value: 3, emoji: "😐", label: "Even" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😊", label: "Bright" },
] as const;

interface JournalEditorProps {
  date: string;
  compact?: boolean;
  onSaved?: () => void;
}

export function JournalEditor({ date, compact = false, onSaved }: JournalEditorProps) {
  const { data, setJournal } = useData();
  const entry = data.journal[date];
  const [content, setContent] = useState(entry?.content ?? "");
  const [mood, setMood] = useState<JournalEntry["mood"]>(entry?.mood);
  const [saved, setSaved] = useState<"idle" | "saving" | "saved">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track the date that the current content/mood belong to (for flushing on switch)
  const contentDateRef = useRef<string>(date);
  // Latest content/mood, accessible from cleanup-time flush
  const contentRef = useRef<string>(content);
  const moodRef = useRef<JournalEntry["mood"]>(mood);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);
  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  useEffect(() => {
    setContent(data.journal[date]?.content ?? "");
    setMood(data.journal[date]?.mood);
    contentDateRef.current = date;
  }, [date, data.journal]);

  useEffect(() => {
    if (content === (entry?.content ?? "") && mood === entry?.mood) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaved("saving");
    debounceRef.current = setTimeout(() => {
      setJournal(contentDateRef.current, content, mood === undefined ? "clear" : mood);
      setSaved("saved");
      onSaved?.();
      setTimeout(() => setSaved("idle"), 1500);
    }, 600);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        // Flush pending save synchronously so switching dates doesn't drop content
        const d = contentDateRef.current;
        const c = contentRef.current;
        const m = moodRef.current;
        const existing = data.journal[d];
        if (c !== (existing?.content ?? "") || m !== existing?.mood) {
          setJournal(d, c, m === undefined ? "clear" : m);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, mood]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-serif text-xl italic">Journal</h2>
          <p className="text-xs text-[var(--fg-soft)] mt-0.5">
            A line a day. Quiet, honest, brief.
          </p>
        </div>
        <div
          className={cn(
            "text-[10px] uppercase tracking-wider transition-opacity",
            saved === "idle" ? "opacity-0" : "opacity-100",
            saved === "saved" ? "text-sage-500" : "text-[var(--fg-muted)]",
          )}
        >
          {saved === "saving" ? "Saving…" : (
            <span className="inline-flex items-center gap-1"><Check className="h-3 w-3" /> Saved</span>
          )}
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider text-[var(--fg-soft)]">Mood</span>
        <div className="flex gap-1.5">
          {moods.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(mood === m.value ? undefined : m.value)}
              className={cn(
                "h-9 w-9 rounded-md text-lg transition-all border",
                mood === m.value
                  ? "bg-[var(--accent-soft)] border-[var(--accent)] scale-110"
                  : "border-transparent hover:bg-cream-200 dark:hover:bg-ink-400",
              )}
              aria-label={m.label}
              title={m.label}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={compact ? 4 : 10}
        placeholder="What did today hold?"
        className="w-full bg-transparent text-sm leading-relaxed font-serif italic placeholder:text-[var(--fg-muted)] focus:outline-none resize-none"
        style={{ color: "var(--fg)" }}
      />

      <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--fg-muted)]">
        <span>{content.trim().split(/\s+/).filter(Boolean).length} words</span>
        <span>Auto-saved</span>
      </div>
    </Card>
  );
}
