"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border bg-transparent px-3 text-sm",
        "placeholder:text-[var(--fg-muted)]",
        "focus:outline-none focus:ring-1 focus:ring-[var(--accent)]",
        "transition-colors",
        className,
      )}
      style={{ borderColor: "var(--border)" }}
      {...rest}
    />
  );
});

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-md border bg-transparent p-3 text-sm leading-relaxed",
        "placeholder:text-[var(--fg-muted)]",
        "focus:outline-none focus:ring-1 focus:ring-[var(--accent)]",
        "transition-colors resize-none",
        className,
      )}
      style={{ borderColor: "var(--border)" }}
      {...rest}
    />
  );
});

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border bg-transparent px-3 text-sm",
        "focus:outline-none focus:ring-1 focus:ring-[var(--accent)]",
        className,
      )}
      style={{ borderColor: "var(--border)" }}
      {...rest}
    >
      {children}
    </select>
  );
});

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, children, ...rest },
  ref,
) {
  return (
    <label
      ref={ref}
      className={cn("text-xs font-medium uppercase tracking-wider text-[var(--fg-soft)]", className)}
      {...rest}
    >
      {children}
    </label>
  );
});
