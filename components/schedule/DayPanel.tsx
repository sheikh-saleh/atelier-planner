"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskList } from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";

interface DayPanelProps {
  date: string | null;
  onClose: () => void;
}

export function DayPanel({ date, onClose }: DayPanelProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (date) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
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
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed top-0 right-0 z-50 h-full overflow-y-auto",
              "w-full bg-[var(--bg-card)] border-l shadow-xl",
              "lg:w-96 lg:shadow-2xl",
            )}
            style={{ borderColor: "var(--border-soft)" }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-[var(--bg-card)]/95 backdrop-blur" style={{ borderColor: "var(--border-soft)" }}>
              <h3 className="font-serif text-lg italic" style={{ color: "var(--fg)" }}>
                {formatDate(date, "EEEE, MMMM d")}
              </h3>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
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
