"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User, Session, AuthError, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "../supabase/client";
import type { Database } from "../supabase/database.types";

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{
    error?: string;
    needsEmailConfirmation?: boolean;
  }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

type DbClient = SupabaseClient<Database>;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<DbClient | null>(null);

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const { data: listen } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
      },
    );
    void supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });
    return () => {
      listen.subscription.unsubscribe();
    };
  }, [supabase]);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      if (!supabase) return { error: "Klienten er ikke klar" };
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: origin
            ? `${origin}/auth/callback?next=${encodeURIComponent("/onboarding/push")}`
            : undefined,
        },
      });
      if (error) {
        return { error: messageFromAuthError(error) };
      }
      if (data.session?.user?.id) {
        // Backup: handle_new_user() trigger (008) populates full_name from raw_user_meta_data.
        // This UPDATE is idempotent and covers edge cases where the row still lacks full_name.
        const { error: uerr } = await supabase
          .from("users")
          .update({ full_name: fullName })
          .eq("id", data.session.user.id);
        if (uerr) {
          return { error: uerr.message };
        }
      }
      if (!data.session) {
        return { needsEmailConfirmation: true };
      }
      return {};
    },
    [supabase],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return { error: "Klienten er ikke klar" };
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        return { error: messageFromAuthError(error) };
      }
      return {};
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
  }, [supabase]);

  const resetPassword = useCallback(
    async (email: string) => {
      if (!supabase) return { error: "Klienten er ikke klar" };
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${origin}/reset-passord` },
      );
      if (error) {
        return { error: messageFromAuthError(error) };
      }
      return {};
    },
    [supabase],
  );

  const updatePassword = useCallback(
    async (newPassword: string) => {
      if (!supabase) return { error: "Klienten er ikke klar" };
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        return { error: messageFromAuthError(error) };
      }
      return {};
    },
    [supabase],
  );

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
    }),
    [
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

function messageFromAuthError(err: AuthError) {
  return err.message;
}
