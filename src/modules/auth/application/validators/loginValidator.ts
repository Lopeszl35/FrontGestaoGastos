import type { FieldErrors, LoginDTO } from "../../../../types/auth";

export type LoginFields = "email" | "password";

function isValidEmail(email: string): boolean {
  const v = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function validateLogin(input: LoginDTO): FieldErrors<LoginFields> {
  const errors: FieldErrors<LoginFields> = {};

  if (!input.email.trim()) errors.email = "E-mail é obrigatório.";
  else if (!isValidEmail(input.email)) errors.email = "E-mail inválido.";

  if (!input.password) errors.password = "Senha é obrigatória.";
  else if (input.password.length < 8) errors.password = "Senha deve ter no mínimo 8 caracteres.";

  return errors;
}

export function hasErrors<T extends string>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
