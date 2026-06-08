"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  signInGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [guestUser, setGuestUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("atelier-guest-user");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const finish = () => {
      if (mountedRef.current) setLoading(false);
    };

    // Safety: always stop loading after 5 seconds no matter what
    const safetyTimer = setTimeout(finish, 5000);

    supabase.auth
      .getSession()
      .then(({ data: { session: s } }) => {
        if (mountedRef.current) setSession(s);
      })
      .catch(() => {
        if (mountedRef.current) setSession(null);
      })
      .finally(finish);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      if (mountedRef.current) setSession(s);
    });

    return () => {
      mountedRef.current = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: name ? { data: { full_name: name } } : undefined,
    });
    return { error: error?.message };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setGuestUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("atelier-guest-user");
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    return { error: error?.message };
  }, []);

  const signInGuest = useCallback(async () => {
    const dummyUser: User = {
      id: "guest-user",
      email: "guest@local",
      app_metadata: {},
      user_metadata: { full_name: "Guest User" },
      aud: "authenticated",
      created_at: new Date().toISOString(),
    };
    setGuestUser(dummyUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("atelier-guest-user", JSON.stringify(dummyUser));
    }
  }, []);

  const user = useMemo(() => session?.user ?? guestUser ?? null, [session, guestUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      signInGuest,
    }),
    [user, session, loading, signIn, signUp, signOut, resetPassword, signInGuest],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
