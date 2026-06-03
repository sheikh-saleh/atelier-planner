"use client";

import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Brand } from "./Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="lg:hidden sticky top-0 z-20 border-b bg-[var(--bg)]/95 backdrop-blur" style={{ borderColor: "var(--border-soft)" }}>
          <div className="px-5 py-3.5">
            <Brand />
          </div>
        </div>
        <main className="flex-1 px-5 sm:px-8 lg:px-12 py-6 sm:py-10 pb-24 lg:pb-12 max-w-6xl mx-auto w-full">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
