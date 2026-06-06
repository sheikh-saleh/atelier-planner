"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { AppShell } from "@/components/layout/AppShell";

const PUBLIC_PATHS = new Set(["/", "/pricing", "/about", "/auth"]);

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  return false;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const publicPage = isPublicPath(pathname);

  useEffect(() => {
    if (loading) return;

    if (!user && !publicPage) {
      router.replace("/auth");
      return;
    }

    if (user && pathname === "/") {
      router.replace("/app");
      return;
    }

    setReady(true);
  }, [user, loading, publicPage, pathname, router]);

  if (loading || !ready) {
    if (publicPage) return <>{children}</>;
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <p className="font-serif text-sm italic" style={{ color: "var(--fg-muted)" }}>
          Loading…
        </p>
      </div>
    );
  }

  if (publicPage) return <>{children}</>;

  return <AppShell>{children}</AppShell>;
}
