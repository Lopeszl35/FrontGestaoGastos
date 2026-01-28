import type { FinancialProfile } from "../../types/auth";

/**
 * Front usa FinancialProfile (CONSERVADOR/MODERADO/AGRESSIVO).
 * Backend historicamente já apareceu como: conservador/moderado/agressivo e também arrojado.
 *
 * Política:
 * - Ser tolerante ao LER (aceita variações).
 * - Ser conservador ao ESCREVER (mantém 'agressivo' como padrão para não quebrar back).
 */

export function mapProfileFromBackend(raw: string | null | undefined): FinancialProfile {
  const v = (raw ?? "").toString().trim().toLowerCase();

  if (v === "conservador") return "CONSERVADOR";
  if (v === "moderado") return "MODERADO";

  // defensivo: alguns ambientes usam 'arrojado'
  if (v === "arrojado") return "AGRESSIVO";

  if (v === "agressivo") return "AGRESSIVO";

  // fallback: evita quebrar UI em caso de valor inesperado
  return "MODERADO";
}

/**
 * Converte o enum da UI para o valor esperado pelo backend.
 *
 * Nota importante: mantemos 'agressivo' (e não 'arrojado') por padrão,
 * porque o backend atual do projeto já funciona com esse valor nos fluxos
 * de createUser/login. Se alguma rota validar apenas 'arrojado', use o
 * helper `mapProfileToBackendWithFallback`.
 */
export function mapProfileToBackend(fp: FinancialProfile): string {
  if (fp === "CONSERVADOR") return "conservador";
  if (fp === "MODERADO") return "moderado";
  return "agressivo";
}

/**
 * Alternativa robusta para endpoints que podem exigir 'arrojado'.
 * Retorna [primary, fallback].
 */
export function mapProfileToBackendWithFallback(fp: FinancialProfile): [string, string] {
  if (fp !== "AGRESSIVO") {
    const v = mapProfileToBackend(fp);
    return [v, v];
  }
  return ["agressivo", "arrojado"];
}
