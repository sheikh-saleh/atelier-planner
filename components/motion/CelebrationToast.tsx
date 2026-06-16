"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CelebrationToastProps {
  show: boolean;
  message: string;
  type?: "streak" | "complete" | "best" | "default";
  onClose: () => void;
  duration?: number;
}

function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 200,
      y: -(Math.random() * 150 + 50),
      rotation: Math.random() * 360,
      color: ["var(--gold-300)", "var(--sage-300)", "var(--cream-300)", "var(--accent)"][i % 4],
      delay: Math.random() * 0.2,
    })),
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 h-2 w-2 rounded-sm"
          style={{ backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            rotate: p.rotation,
            scale: 0.5,
          }}
          transition={{
            duration: 1.5,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

const typeStyles: Record<string, string> = {
  streak: "border-gold-300 bg-gold-50",
  complete: "border-sage-300 bg-sage-50",
  best: "border-burgundy-300 bg-burgundy-50",
  default: "border-[var(--border)] bg-[var(--bg-card)]",
};

export function CelebrationToast({
  show,
  message,
  type = "default",
  onClose,
  duration = 4000,
}: CelebrationToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="relative">
            {(type === "streak" || type === "best") && <Confetti />}
            <div
              className={cn(
                "relative flex items-center gap-3 rounded-lg border px-4 py-3 shadow-soft",
                "font-serif text-sm",
                typeStyles[type],
              )}
            >
              <span>{message}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
