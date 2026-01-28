import { ApiUserRepository } from "../repositories/ApiUserRepository";

export function makeUserRepository() {
  return new ApiUserRepository();
}
