"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user && pathname !== "/auth") {
      router.replace("/auth");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-serif text-sm italic" style={{ color: "var(--fg-muted)" }}>
          Loading…
        </p>
      </div>
    );
  }

  if (!user && pathname !== "/auth") return null;

  return <>{children}</>;
}
