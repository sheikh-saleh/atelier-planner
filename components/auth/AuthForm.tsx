"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
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
  const [showPassword, setShowPassword] = useState(false);

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
        if (!name.trim()) {
          setError("Name is required");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        const res = await signUp(email, password, name.trim());
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

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setSuccess("");
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-2xl italic" style={{ color: "var(--fg)" }}>
          {mode === "signin" && "Welcome back"}
          {mode === "signup" && "Create your account"}
          {mode === "reset" && "Reset your password"}
        </h2>
        <p className="mt-1.5 text-sm" style={{ color: "var(--fg-soft)" }}>
          {mode === "signin" && "Sign in to sync your progress across devices."}
          {mode === "signup" && "Start building better habits today."}
          {mode === "reset" && "We'll send you a link to reset it."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === "signup" && (
          <div className="space-y-1.5">
            <Label htmlFor="auth-name">Full name</Label>
            <Input
              id="auth-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Doe"
              autoComplete="name"
              required
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
            <div className="relative">
              <Input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={6}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm font-medium text-burgundy-400 animate-[shake_0.3s_ease-in-out]">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-sage-600">{success}</p>
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

      <div className="mt-6 text-center">
        {mode === "signin" && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => switchMode("reset")}
              className="text-sm hover:underline"
              style={{ color: "var(--fg-soft)" }}
            >
              Forgot your password?
            </button>
            <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="font-medium hover:underline"
                style={{ color: "var(--accent)" }}
              >
                Sign up
              </button>
            </p>
          </div>
        )}

        {mode === "signup" && (
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="font-medium hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Sign in
            </button>
          </p>
        )}

        {mode === "reset" && (
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Back to sign in
          </button>
        )}
      </div>
    </div>
  );
}
