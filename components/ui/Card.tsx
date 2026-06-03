"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
  padded?: boolean;
  paper?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, bordered = true, padded = true, paper = false, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl bg-[var(--bg-card)]",
        bordered && "border",
        paper && "paper",
        padded && "p-5 sm:p-6",
        "shadow-soft",
        className,
      )}
      style={bordered ? { borderColor: "var(--border-soft)" } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
});
