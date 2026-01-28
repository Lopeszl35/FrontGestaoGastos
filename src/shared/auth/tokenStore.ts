import type { AuthResult } from "../../types/auth";
import type { AuthToken, AuthUser } from "../../types/auth";

let currentToken: AuthToken | null = null;
let currentUser: AuthUser | null = null;

export function setAuthResult(result: AuthResult) {
  currentToken = result.token;
  currentUser = result.user;
}

export function clearAuth() {
  currentToken = null;
  currentUser = null;
}

export function getAuthToken(): AuthToken | null {
  return currentToken;
}

export function getAuthUser(): AuthUser | null {
  return currentUser;
}

/**
 * Atualiza parcialmente o usuário em memória.
 * Útil para manter o UserContext consistente após edição de perfil.
 */
export function updateAuthUser(partial: Partial<AuthUser>) {
  if (!currentUser) return;
  currentUser = { ...currentUser, ...partial };
}

/**
 * ✅ agora funciona com backend (id_usuario)
 * e mantém compatibilidade com legado (id)
 */
export function getAuthUserId(): number | null {
  if (!currentUser) return null;

  const raw =
    (currentUser as any).id_usuario ??
    (currentUser as any).id ??
    null;

  if (raw == null) return null;

  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}
