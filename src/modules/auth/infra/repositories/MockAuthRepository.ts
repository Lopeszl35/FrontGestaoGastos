import type { AuthRepository } from "../../application/ports/AuthRepository";
import type { AuthResult, LoginDTO, RegisterDTO, ServiceError } from "../../../../types/auth";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeError(message: string, code?: string): ServiceError {
  return { message, code };
}

const DEMO_EMAIL = "demo@demo.com";
const DEMO_PASS = "12345678";

export class MockAuthRepository implements AuthRepository {
  async login(payload: LoginDTO): Promise<AuthResult> {
    await wait(900);

    const email = payload.email.trim().toLowerCase();
    const pass = payload.password;

    if (email === DEMO_EMAIL && pass === DEMO_PASS) {
      return {
        token: "mock.jwt.token",
        user: {
          id: "usr_demo",
          nome: "Usuário Demo",
          email,
          perfil_financeiro: "MODERADO",
        },
      };
    }

    throw makeError("Credenciais inválidas. Verifique e-mail e senha.", "INVALID_CREDENTIALS");
  }

  async register(payload: RegisterDTO): Promise<AuthResult> {
    await wait(1100);

    const email = payload.email.trim().toLowerCase();
    if (email === DEMO_EMAIL) {
      throw makeError("Este e-mail já está em uso.", "EMAIL_ALREADY_EXISTS");
    }

    return {
      token: "mock.jwt.token.new",
      user: {
        id: `usr_${Math.random().toString(16).slice(2)}`,
        nome: payload.fullName.trim(),
        email,
        perfil_financeiro: payload.financialProfile,
      },
    };
  }
}
