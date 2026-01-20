export function parseNumberLoose(input: string): number | null {
  const normalized = input.replace(/\./g, "").replace(",", ".").trim();
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}
