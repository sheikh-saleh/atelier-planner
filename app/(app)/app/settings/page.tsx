"use client";

import { Header } from "@/components/layout/Header";
import { SettingsPanel } from "@/components/settings/SettingsPanel";

export default function SettingsPage() {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl">
      <Header
        title="Settings"
        subtitle="Tune the atelier to your liking."
      />
      <SettingsPanel />
    </div>
  );
}
