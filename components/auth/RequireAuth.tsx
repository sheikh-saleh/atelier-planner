"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user && pathname !== "/auth") {
      router.replace("/auth");
      return;
    }

    setReady(true);
  }, [user, loading, pathname, router]);

  if (loading || !ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-serif text-sm italic" style={{ color: "var(--fg-muted)" }}>
          Loading…
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
