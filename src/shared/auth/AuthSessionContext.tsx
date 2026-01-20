import React, { createContext, useContext, useMemo, useState } from "react";
import type { AuthResult } from "../../types/auth";

type AuthSessionState = {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthResult["user"] | null;
};

type AuthSessionActions = {
  signIn: (result: AuthResult) => void;
  signOut: () => void;
};

type AuthSessionContextValue = AuthSessionState & AuthSessionActions;

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthResult["user"] | null>(null);

  const value = useMemo<AuthSessionContextValue>(() => {
    return {
      isAuthenticated: !!token,
      token,
      user,
      signIn: (result) => {
        setToken(result.token);
        setUser(result.user);
      },
      signOut: () => {
        setToken(null);
        setUser(null);
      },
    };
  }, [token, user]);

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const ctx = useContext(AuthSessionContext);
  if (!ctx) throw new Error("useAuthSession must be used within AuthSessionProvider");
  return ctx;
}
