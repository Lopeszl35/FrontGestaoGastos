// src/shared/auth/AuthSessionContext.tsx

import React, { createContext, useContext, useMemo, useState } from "react";
import type { AuthResult } from "../../types/auth";
import { setAuthResult, clearAuth, getAuthToken, getAuthUser } from "./tokenStore";

type AuthSessionContextValue = {
  session: AuthResult | null;
  token: string | null;
  user: ReturnType<typeof getAuthUser>;
  isAuthenticated: boolean;
  signIn: (result: AuthResult) => void;
  signOut: () => void;
  logout: () => void;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthResult | null>(() => {
    const token = getAuthToken();
    const user = getAuthUser();
    if (!token || !user) return null;
    return { token, user } as AuthResult;
  });

  const value = useMemo<AuthSessionContextValue>(() => {
    const token = session?.token ?? null;
    const user = session?.user ?? null;

    // Função única para limpar a sessão
    const performLogout = () => {
      clearAuth();
      setSession(null);
    };

    return {
      session,
      token,
      user,
      isAuthenticated: Boolean(token),
      signIn: (result) => {
        setAuthResult(result);
        setSession(result);
      },
      signOut: performLogout,
      logout: performLogout,
    };
  }, [session]);

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const ctx = useContext(AuthSessionContext);
  if (!ctx) throw new Error("useAuthSession deve ser usado dentro de AuthSessionProvider");
  return ctx;
}