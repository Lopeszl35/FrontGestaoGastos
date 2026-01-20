import type { AuthRepository } from "../../application/ports/AuthRepository";
import type { AuthResult, LoginDTO, RegisterDTO, FinancialProfile } from "../../../../types/auth";
import { httpRequest } from "../../../../shared/http/httpClient";

type BackendLoginResponse = {
  user: {
    id_usuario: number;
    nome: string;
    email: string;
    perfil_financeiro: string;
    salario_mensal?: number;
    saldo_atual?: number;
    saldo_inicial?: number;
  };
  token: string;
};

type BackendCreateUserResponse = {
  message: string;
  status: number;
  data: any;
};

function mapProfileToBackend(fp: FinancialProfile): string {
  if (fp === "CONSERVADOR") return "conservador";
  if (fp === "AGRESSIVO") return "agressivo";
  return "moderado";
}

function mapProfileFromBackend(fp: string): FinancialProfile {
  const v = (fp ?? "").toLowerCase();
  if (v === "conservador") return "CONSERVADOR";
  if (v === "agressivo") return "AGRESSIVO";
  return "MODERADO";
}

function mapLoginToAuthResult(res: BackendLoginResponse): AuthResult {
  return {
    token: res.token,
    user: {
      id: String(res.user.id_usuario),
      fullName: res.user.nome,
      email: res.user.email,
      financialProfile: mapProfileFromBackend(res.user.perfil_financeiro),
    },
  };
}

export class ApiAuthRepository implements AuthRepository {
  async login(payload: LoginDTO): Promise<AuthResult> {
    const res = await httpRequest<BackendLoginResponse>("POST", "/loginUser", {
      email: payload.email,
      senha: payload.password,
    });

    return mapLoginToAuthResult(res);
  }

  async register(payload: RegisterDTO): Promise<AuthResult> {
    await httpRequest<BackendCreateUserResponse>("POST", "/createUser", {
      user: {
        nome: payload.fullName,
        email: payload.email,
        senha_hash: payload.password, // backend faz hash
        perfil_financeiro: mapProfileToBackend(payload.financialProfile),
        salario_mensal: payload.salary,
        saldo_inicial: payload.initialBalance,
      },
    });

    // backend não retorna token no createUser → loga em seguida
    const loginRes = await httpRequest<BackendLoginResponse>("POST", "/loginUser", {
      email: payload.email,
      senha: payload.password,
    });

    return mapLoginToAuthResult(loginRes);
  }
}
