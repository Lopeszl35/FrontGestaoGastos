export type FinancialProfile = "CONSERVADOR" | "MODERADO" | "AGRESSIVO";

export const FinancialProfileLabel: Record<FinancialProfile, string> = {
  CONSERVADOR: "Conservador",
  MODERADO: "Moderado",
  AGRESSIVO: "Arrojado",
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
  id_usuario?: number;
  id?: string;
  nome: string;
  email: string;
  perfil_financeiro: FinancialProfile;
  salario_mensal?: number;
  saldo_atual?: number;
  saldo_inicial?: number;
};

export type AuthResult = {
  token: string;
  user: AuthUser;
};

export type AuthToken = string;

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export type ServiceError = {
  message: string;
  code?: string;
};
