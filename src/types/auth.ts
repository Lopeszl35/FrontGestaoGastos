export type FinancialProfile = "CONSERVADOR" | "MODERADO" | "AGRESSIVO";

export const FinancialProfileLabel: Record<FinancialProfile, string> = {
  CONSERVADOR: "Conservador",
  MODERADO: "Moderado",
  AGRESSIVO: "Agressivo",
};

export type LoginDTO = {
  email: string;
  password: string;
};

export type RegisterDTO = {
  fullName: string;
  email: string;
  password: string;
  salary?: number;
  initialBalance?: number;
  financialProfile: FinancialProfile;
};

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  financialProfile: FinancialProfile;
};

export type AuthResult = {
  token: string;
  user: AuthUser;
};

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export type ServiceError = {
  message: string;
  code?: string;
};
