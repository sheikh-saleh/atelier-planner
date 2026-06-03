"use client";

import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  className?: string;
  label?: React.ReactNode;
  trackColor?: string;
  fillColor?: string;
}

export function ProgressRing({
  value,
  size = 120,
  stroke = 8,
  className,
  label,
  trackColor,
  fillColor,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor ?? "var(--border)"}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={fillColor ?? "var(--accent)"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{label}</div>
    </div>
  );
}
