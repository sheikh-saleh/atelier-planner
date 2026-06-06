"use client";

import { Header } from "@/components/layout/Header";
import { JournalView } from "@/components/journal/JournalView";

export default function JournalPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <Header
        title="Journal"
        subtitle="A line a day. Quiet, honest, brief."
      />
      <JournalView />
    </div>
  );
}
