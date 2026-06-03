"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ open, onClose, title, children, size = "md", className }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // Focus first focusable element in dialog (or the dialog itself)
    const t = window.setTimeout(() => {
      if (!dialogRef.current) return;
      const focusable = dialogRef.current.querySelector<HTMLElement>(FOCUSABLE);
      (focusable ?? dialogRef.current).focus();
    }, 0);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-ink-500/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId.current : undefined}
        tabIndex={-1}
        className={cn(
          "relative w-full rounded-xl border bg-[var(--bg-card)] shadow-card animate-scale-in outline-none",
          sizeMap[size],
          className,
        )}
        style={{ borderColor: "var(--border-soft)" }}
      >
        {title && (
          <div
            className="flex items-center justify-between border-b px-5 py-4"
            style={{ borderColor: "var(--border-soft)" }}
          >
            <h3 id={titleId.current} className="font-serif text-lg italic">{title}</h3>
            <button
              onClick={onClose}
              type="button"
              className="rounded-md p-1 text-[var(--fg-soft)] hover:bg-cream-200 dark:hover:bg-ink-400 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
