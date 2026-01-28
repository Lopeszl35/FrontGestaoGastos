import type { AuthRepository } from "../../application/ports/AuthRepository";
import type { AuthResult, LoginDTO, RegisterDTO } from "../../../../types/auth";
import { httpRequest } from "../../../../shared/http/httpClient";
import { mapProfileFromBackend, mapProfileToBackend } from "../../../../shared/utils/financialProfile";

type BackendLoginResponse = {
  token: string;
  user: {
    id_usuario: number;
    nome: string;
    email: string;
    perfil_financeiro: string;
    salario_mensal?: number;
    saldo_atual?: number;
    saldo_inicial?: number;
  };
};

type BackendCreateUserResponse = {
  message: string;
  status: number;
  data: any;
};

function mapLoginToAuthResult(res: BackendLoginResponse): AuthResult {
  return {
    token: res.token,
    user: {
      id: String(res.user.id_usuario),
      nome: res.user.nome,
      email: res.user.email,
      perfil_financeiro: mapProfileFromBackend(res.user.perfil_financeiro),
      salario_mensal: res.user.salario_mensal,
      saldo_atual: res.user.saldo_atual,
      saldo_inicial: res.user.saldo_inicial,
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
