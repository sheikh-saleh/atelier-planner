"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { AppShell } from "@/components/layout/AppShell";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const isAuthPage = pathname === "/auth";

  useEffect(() => {
    if (loading) return;

    if (!user && !isAuthPage) {
      router.replace("/auth");
      return;
    }

    setReady(true);
  }, [user, loading, isAuthPage, router]);

  if (loading || !ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <p className="font-serif text-sm italic" style={{ color: "var(--fg-muted)" }}>
          Loading…
        </p>
      </div>
    );
  }

  if (isAuthPage) return <>{children}</>;

  return <AppShell>{children}</AppShell>;
}
