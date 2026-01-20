import type { AuthRepository } from "../ports/AuthRepository";
import type { AuthResult, RegisterDTO } from "../../../../types/auth";

export async function registerUseCase(repo: AuthRepository, input: RegisterDTO): Promise<AuthResult> {
  return repo.register(input);
}
