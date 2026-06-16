"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ShortcutOverlayProps {
  show: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: "n", action: "New task" },
  { key: "h", action: "New habit" },
  { key: "j", action: "Journal entry" },
  { key: "t", action: "Start/pause timer" },
  { key: "?", action: "Toggle this overlay" },
  { key: "Esc", action: "Close modal / cancel" },
  { key: "1-7", action: "Navigate to page" },
];

export function ShortcutOverlay({ show, onClose }: ShortcutOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-xl border bg-[var(--bg-card)] p-6 shadow-card"
              style={{ borderColor: "var(--border)" }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              role="dialog"
              aria-label="Keyboard shortcuts"
            >
              <h2 className="font-serif text-lg italic mb-4" style={{ color: "var(--fg)" }}>
                Keyboard Shortcuts
              </h2>
              <div className="space-y-2">
                {shortcuts.map((s) => (
                  <div key={s.key} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "var(--fg-soft)" }}>
                      {s.action}
                    </span>
                    <kbd className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded border text-xs font-mono bg-[var(--bg-soft)]">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
              <button
                onClick={onClose}
                className="mt-4 w-full h-8 rounded-md text-xs font-medium transition-colors hover:bg-[var(--bg-soft)]"
                style={{ color: "var(--fg-soft)" }}
              >
                Close (Esc)
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
