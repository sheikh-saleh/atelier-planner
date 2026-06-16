"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { motion } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ink-500 text-cream-50 hover:bg-ink-400 dark:bg-cream-100 dark:text-ink-500 dark:hover:bg-cream-200",
  secondary:
    "bg-cream-200 text-ink-500 hover:bg-cream-300 dark:bg-ink-400 dark:text-cream-100 dark:hover:bg-ink-300",
  ghost: "bg-transparent text-ink-400 hover:bg-cream-200 dark:text-cream-200 dark:hover:bg-ink-400",
  danger: "bg-burgundy-300 text-cream-50 hover:bg-burgundy-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "secondary", size = "md", type = "button", disabled, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-wide",
        "transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
        "border border-transparent",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...(rest as any)}
    />
  );
});
