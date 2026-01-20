import type { AuthRepository } from "../../application/ports/AuthRepository";
import { MockAuthRepository } from "../repositories/MockAuthRepository";
import { ApiAuthRepository } from "../repositories/ApiAuthRepository";

export function makeAuthRepository(): AuthRepository {
  const useApi = (process.env.EXPO_PUBLIC_USE_API ?? "true") === "true";
  return useApi ? new ApiAuthRepository() : new MockAuthRepository();
}
