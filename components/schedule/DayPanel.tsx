"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskList } from "@/components/tasks/TaskList";
import { formatDate } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";

interface DayPanelProps {
  date: string | null;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function DayPanel({ date, onClose }: DayPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useRef(`day-panel-title-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    if (!date) return;
    const panel = panelRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panel) {
        const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    const t = window.setTimeout(() => {
      if (!panel) return;
      const focusable = panel.querySelector<HTMLElement>(FOCUSABLE);
      (focusable ?? panel).focus();
    }, 0);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [date, onClose]);

  return (
    <AnimatePresence>
      {date && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId.current}
            tabIndex={-1}
            className={cn(
              "fixed top-0 right-0 z-50 h-full overflow-y-auto outline-none",
              "w-full bg-[var(--bg-card)] border-l shadow-xl",
              "lg:w-96 lg:shadow-2xl",
            )}
            style={{ borderColor: "var(--border-soft)" }}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-[var(--bg-card)]/95 backdrop-blur"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <h3
                id={titleId.current}
                className="font-serif text-lg italic"
                style={{ color: "var(--fg)" }}
              >
                {formatDate(date, "EEEE, MMMM d")}
              </h3>
              <button
                onClick={onClose}
                type="button"
                className="rounded-md p-1.5 text-[var(--fg-soft)] hover:bg-cream-200 dark:hover:bg-ink-400 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tasks for this day */}
            <div className="p-4">
              <TaskList date={date} showAdd={true} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
