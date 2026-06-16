"use client";

import { Header } from "@/components/layout/Header";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { AnimatedPage } from "@/components/motion";

export default function SettingsPage() {
  return (
    <AnimatedPage>
      <div className="space-y-6 sm:space-y-8 max-w-3xl">
        <Header
          title="Settings"
          subtitle="Tune the atelier to your liking."
        />
        <SettingsPanel />
      </div>
    </AnimatedPage>
  );
}
