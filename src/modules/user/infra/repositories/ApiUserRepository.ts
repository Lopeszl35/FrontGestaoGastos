import { httpRequest } from "../../../../shared/http/httpClient";
import type {
  UpdateUserPayload,
  UserRepository,
  UserSaldo,
} from "../../application/ports/UserRepository";

export class ApiUserRepository implements UserRepository {
  async getUserSaldo(token: string): Promise<UserSaldo> {
    return httpRequest<UserSaldo>("GET", "/userSaldo", undefined, token);
  }

  async updateUserSaldo(token: string, saldoAtual: number): Promise<UserSaldo> {
    return httpRequest<UserSaldo>(
      "PUT",
      "/userSaldo",
      { saldo_atual: saldoAtual },
      token
    );
  }

  async updateUser(token: string, userId: number, payload: UpdateUserPayload) {
    // Em alguns ambientes o backend valida perfil_financeiro como 'arrojado' ao invés de 'agressivo'.
    // Como a política do projeto é: "ser tolerante ao ler e conservador ao escrever",
    // tentamos primeiro como veio do payload; se falhar por validação de perfil, tentamos fallback.
    try {
      return await httpRequest<any>("PUT", `/atualizarUsuario/${userId}`, payload, token);
    } catch (err: any) {
      const msg = String(err?.message ?? "").toLowerCase();
      const hasProfile = Object.prototype.hasOwnProperty.call(payload, "perfil_financeiro");
      if (!hasProfile) throw err;

      // tentativa de fallback apenas quando faz sentido
      if (msg.includes("perfil") || msg.includes("financeiro") || msg.includes("validation")) {
        const maybe = String((payload as any).perfil_financeiro ?? "").toLowerCase();
        if (maybe === "agressivo") {
          const retry = { ...payload, perfil_financeiro: "arrojado" };
          return httpRequest<any>("PUT", `/atualizarUsuario/${userId}`, retry, token);
        }
      }
      throw err;
    }
  }
}
