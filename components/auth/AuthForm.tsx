"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";

type Mode = "signin" | "signup" | "reset";

export function AuthForm() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "signin") {
        const res = await signIn(email, password);
        if (res.error) setError(res.error);
      } else if (mode === "signup") {
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        const res = await signUp(email, password, name || undefined);
        if (res.error) setError(res.error);
        else setSuccess("Check your email for a confirmation link.");
      } else {
        const res = await resetPassword(email);
        if (res.error) setError(res.error);
        else setSuccess("Check your email for a password reset link.");
      }
    } finally {
      setLoading(false);
    }
  };

  const titles: Record<Mode, { heading: string; sub: string }> = {
    signin: { heading: "Welcome back", sub: "Sign in to continue your atelier" },
    signup: { heading: "Begin your practice", sub: "Create an account to sync across devices" },
    reset: { heading: "Reset password", sub: "We'll send you a reset link" },
  };

  const { heading, sub } = titles[mode];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl italic" style={{ color: "var(--fg)" }}>
            {heading}
          </h1>
          <p className="text-sm text-[var(--fg-soft)] mt-1 font-serif">{sub}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="auth-name">Name</Label>
              <Input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
                autoComplete="name"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          {mode !== "reset" && (
            <div className="space-y-1.5">
              <Label htmlFor="auth-password">Password</Label>
              <Input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={6}
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-burgundy-400 font-serif animate-[shake_0.3s_ease-in-out]">
              {error}
            </p>
          )}

          {success && (
            <p className="text-xs text-sage-600 font-serif">{success}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : mode === "signin"
                ? "Sign in"
                : mode === "signup"
                  ? "Create account"
                  : "Send reset link"}
          </Button>
        </form>

        <div className="mt-5 text-center space-y-2">
          {mode === "signin" && (
            <>
              <button
                type="button"
                onClick={() => { setMode("reset"); setError(""); setSuccess(""); }}
                className="block w-full text-xs text-[var(--fg-soft)] hover:text-[var(--fg)] font-serif"
              >
                Forgot password?
              </button>
              <p className="text-xs text-[var(--fg-muted)]">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
                  className="text-[var(--accent)] hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            </>
          )}

          {mode === "signup" && (
            <p className="text-xs text-[var(--fg-muted)]">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => { setMode("signin"); setError(""); setSuccess(""); }}
                className="text-[var(--accent)] hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          )}

          {mode === "reset" && (
            <p className="text-xs text-[var(--fg-muted)]">
              <button
                type="button"
                onClick={() => { setMode("signin"); setError(""); setSuccess(""); }}
                className="text-[var(--accent)] hover:underline font-medium"
              >
                Back to sign in
              </button>
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
