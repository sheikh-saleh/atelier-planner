"use client";

import { useState } from "react";
import { Check, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailCaptureProps {
  source: string;
  buttonText?: string;
  placeholder?: string;
  className?: string;
}

export function EmailCapture({
  source,
  buttonText = "Notify me",
  placeholder = "you@example.com",
  className,
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const action = process.env.NEXT_PUBLIC_BUTTONDOWN_FORM_ACTION;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !action) return;

    setState("loading");
    setError("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("bd-hp", "");

      await fetch(action, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });

      setState("success");
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
      setState("error");
    }
  };

  if (!action) {
    return (
      <div
        className={cn(
          "text-sm italic font-serif",
          className,
        )}
        style={{ color: "var(--fg-muted)" }}
      >
        Email signup coming soon.
      </div>
    );
  }

  if (state === "success") {
    return (
      <div
        className={cn("flex items-center justify-center gap-2 text-sm font-medium font-serif", className)}
        style={{ color: "var(--accent)" }}
      >
        <Check className="h-4 w-4" />
        <span>You&apos;re on the list. Welcome.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col sm:flex-row gap-2 w-full", className)}
      data-source={source}
    >
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "var(--fg-muted)" }} />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          aria-label="Email address"
          className="h-11 w-full rounded-md border bg-transparent pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          style={{ borderColor: "var(--border)" }}
        />
      </div>
      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex items-center justify-center h-11 px-5 rounded-md text-sm font-medium tracking-wide bg-ink-500 text-cream-50 hover:bg-ink-400 dark:bg-cream-100 dark:text-ink-500 dark:hover:bg-cream-200 transition-colors disabled:opacity-50"
      >
        {state === "loading" ? "Please wait…" : buttonText}
      </button>
      {error && (
        <p className="text-xs text-burgundy-400 sm:absolute sm:-bottom-6 sm:left-0">{error}</p>
      )}
    </form>
  );
}
