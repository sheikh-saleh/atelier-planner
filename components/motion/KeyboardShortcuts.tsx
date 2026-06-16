"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ShortcutOverlay } from "./ShortcutOverlay";

const pageShortcuts: Record<string, string> = {
  "1": "/app",
  "2": "/app/habits",
  "3": "/app/timer",
  "4": "/app/journal",
  "5": "/app/stats",
  "6": "/app/projects",
  "7": "/app/settings",
};

export function KeyboardShortcuts() {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || target.isContentEditable) {
        return;
      }

      if (e.key === "Escape") {
        setShowOverlay(false);
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setShowOverlay((prev) => !prev);
        return;
      }

      if (e.key in pageShortcuts) {
        e.preventDefault();
        router.push(pageShortcuts[e.key]);
        return;
      }

      const customShortcuts: Record<string, string> = {
        n: "atelier:new-task",
        h: "atelier:new-habit",
        j: "atelier:focus-journal",
        t: "atelier:toggle-timer",
      };

      if (e.key in customShortcuts) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(customShortcuts[e.key]));
      }
    },
    [router],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return <ShortcutOverlay show={showOverlay} onClose={() => setShowOverlay(false)} />;
}
