"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import type { ReactNode } from "react";

interface SwipeableItemProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftLabel?: string;
  rightLabel?: string;
  leftColor?: string;
  rightColor?: string;
  threshold?: number;
}

export function SwipeableItem({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftLabel = "Delete",
  rightLabel = "Complete",
  leftColor = "var(--burgundy-300)",
  rightColor = "var(--sage-400)",
  threshold = 80,
}: SwipeableItemProps) {
  const x = useMotionValue(0);
  const leftBg = useTransform(x, [-threshold * 2, -threshold], [leftColor, leftColor]);
  const rightBg = useTransform(x, [threshold, threshold * 2], [rightColor, rightColor]);
  const leftOpacity = useTransform(x, [-threshold * 2, -threshold], [1, 0.8]);
  const rightOpacity = useTransform(x, [threshold, threshold * 2], [0.8, 1]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x < -threshold && onSwipeLeft) {
      onSwipeLeft();
    } else if (info.offset.x > threshold && onSwipeRight) {
      onSwipeRight();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {onSwipeLeft && (
        <motion.div
          className="absolute inset-y-0 left-0 flex items-center pl-4 text-cream-50 text-xs font-medium rounded-l-lg"
          style={{ backgroundColor: leftBg, opacity: leftOpacity, width: "100px" }}
        >
          {leftLabel}
        </motion.div>
      )}
      {onSwipeRight && (
        <motion.div
          className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 text-cream-50 text-xs font-medium rounded-r-lg"
          style={{ backgroundColor: rightBg, opacity: rightOpacity, width: "100px" }}
        >
          {rightLabel}
        </motion.div>
      )}
      <motion.div
        style={{ x }}
        drag={onSwipeLeft || onSwipeRight ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        className="relative z-10 bg-[var(--bg-card)]"
      >
        {children}
      </motion.div>
    </div>
  );
}
