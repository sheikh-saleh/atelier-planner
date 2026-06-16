"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedProgressProps {
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  label?: React.ReactNode;
  trackColor?: string;
  fillColor?: string;
}

export function AnimatedProgress({
  value,
  size = 120,
  stroke = 8,
  className,
  label,
  trackColor,
  fillColor,
}: AnimatedProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useMotionValue(0);
  const springProgress = useSpring(progress, { stiffness: 80, damping: 20 });
  const strokeDashoffset = useTransform(
    springProgress,
    (v) => circumference - (v / 100) * circumference,
  );

  useEffect(() => {
    progress.set(clampedValue);
  }, [clampedValue, progress]);

  return (
    <div className={cn("relative inline-flex w-full h-full items-center justify-center", className)}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        preserveAspectRatio="xMidYMid meet"
        className="-rotate-90 w-full h-full overflow-visible"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor ?? "var(--border)"}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={fillColor ?? "var(--accent)"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{label}</div>
    </div>
  );
}
