"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { AuthForm } from "@/components/auth/AuthForm";

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/app");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <p className="font-serif text-sm italic" style={{ color: "var(--fg-muted)" }}>
          Loading…
        </p>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      {/* Left side — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-ink-500" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative z-10 text-center px-12">
          <h1 className="font-display text-6xl italic text-cream-100 tracking-wide">
            Atelier
          </h1>
          <div className="mt-3 font-serif text-xs uppercase tracking-[0.35em] text-cream-300">
            Daily Routine Planner
          </div>
          <div className="mt-8 max-w-xs mx-auto">
            <p className="font-serif text-sm italic leading-relaxed text-cream-300/80">
              &ldquo;We are what we repeatedly do. Excellence, then, is not an act, but a habit.&rdquo;
            </p>
            <p className="mt-3 font-serif text-xs text-cream-400">
              — Aristotle
            </p>
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile-only brand */}
          <div className="lg:hidden text-center mb-10">
            <h1 className="font-display text-4xl italic" style={{ color: "var(--fg)" }}>
              Atelier
            </h1>
            <p className="mt-1 font-serif text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--fg-muted)" }}>
              Daily Routine
            </p>
          </div>

          <AuthForm />
        </div>
      </div>
    </div>
  );
}
