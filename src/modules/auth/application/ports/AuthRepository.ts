import type { AuthResult, LoginDTO, RegisterDTO } from "../../../../types/auth";

export interface AuthRepository {
  login(payload: LoginDTO): Promise<AuthResult>;
  register(payload: RegisterDTO): Promise<AuthResult>;
}
