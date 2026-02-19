import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export type Role = "applicant" | "member" | "admin";

export type AuthClaims = {
  role?: Role;
  // keep open-ended TODO add more later
  [key: string]: unknown;
};

type AuthContextValue = {
  user: User | null;
  claims: AuthClaims | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<AuthClaims | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged fires:
    // - once on page load (initial auth resolution)
    // - whenever a user signs in/out
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        // Signed out? clear claims and stop loading
        setClaims(null);
        setLoading(false);
        return;
      }

      try {
        // Force refresh so newly set custom claims (e.g., role) are picked up.
        // This matters when you "promote" a user via a Cloud Function.
        const tokenResult = await nextUser.getIdTokenResult(true);
        setClaims((tokenResult.claims ?? {}) as AuthClaims);
      } catch (err) {
        console.error("Failed to fetch ID token claims:", err);
        // Keep the app usable even if claims fail:
        setClaims({});
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, claims, loading }),
    [user, claims, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider.");
  }
  return ctx;
}
