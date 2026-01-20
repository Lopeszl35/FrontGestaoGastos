import type { FieldErrors, RegisterDTO } from "../../../../types/auth";

export type RegisterFields =
  | "fullName"
  | "email"
  | "password"
  | "confirmPassword"
  | "salary"
  | "initialBalance";

function isValidEmail(email: string): boolean {
  const v = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function validateRegister(
  input: Omit<RegisterDTO, "password"> & { password: string; confirmPassword: string }
): FieldErrors<RegisterFields> {
  const errors: FieldErrors<RegisterFields> = {};

  const fullName = input.fullName.trim();
  if (!fullName) errors.fullName = "Nome completo é obrigatório.";
  else if (fullName.split(/\s+/).length < 2) errors.fullName = "Informe nome e sobrenome.";

  if (!input.email.trim()) errors.email = "E-mail é obrigatório.";
  else if (!isValidEmail(input.email)) errors.email = "E-mail inválido.";

  if (!input.password) errors.password = "Senha é obrigatória.";
  else if (input.password.length < 8) errors.password = "Senha deve ter no mínimo 8 caracteres.";

  if (!input.confirmPassword) errors.confirmPassword = "Confirmação de senha é obrigatória.";
  else if (input.confirmPassword !== input.password) errors.confirmPassword = "As senhas não coincidem.";

  if (typeof input.salary === "number" && input.salary < 0) errors.salary = "Salário não pode ser negativo.";
  if (typeof input.initialBalance === "number" && !Number.isFinite(input.initialBalance)) errors.initialBalance = "Saldo inicial inválido.";

  return errors;
}

export function hasErrors<T extends string>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
