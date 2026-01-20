import type { AuthRepository } from "../ports/AuthRepository";
import type { AuthResult, LoginDTO } from "../../../../types/auth";

export async function loginUseCase(repo: AuthRepository, input: LoginDTO): Promise<AuthResult> {
  // regras de aplicação podem crescer aqui (telemetria, auditoria, etc.)
  return repo.login(input);
}
