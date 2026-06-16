"use client";

import { AnimatedProgress } from "@/components/motion";

export function ProgressRing({
  value,
  size = 120,
  stroke = 8,
  className,
  label,
  trackColor,
  fillColor,
}: {
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  label?: React.ReactNode;
  trackColor?: string;
  fillColor?: string;
}) {
  return (
    <AnimatedProgress
      value={value}
      size={size}
      stroke={stroke}
      className={className}
      label={label}
      trackColor={trackColor}
      fillColor={fillColor}
    />
  );
}