"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  placeholder?: string;
}

export function Select({ id, value, onChange, options, className, placeholder }: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "h-10 w-full rounded-md border bg-transparent px-3 pr-9 text-sm text-left",
          "focus:outline-none focus:ring-1 focus:ring-[var(--accent)]",
          "transition-colors flex items-center",
          !selected && "text-[var(--fg-muted)]",
          className,
        )}
        style={{ borderColor: "var(--border)", color: selected ? "var(--fg)" : undefined }}
      >
        {selected?.label ?? placeholder ?? "Select…"}
      </button>
      <ChevronDown
        className={cn(
          "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] transition-transform",
          open && "rotate-180",
        )}
      />
      {open && (
        <ul
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-auto rounded-md border bg-[var(--bg-card)] shadow-soft py-1 animate-fade-in"
          style={{ borderColor: "var(--border-soft)" }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors",
                  "hover:bg-cream-200 dark:hover:bg-ink-400",
                  isSelected && "text-[var(--accent)] font-medium",
                )}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-[var(--accent)]" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
