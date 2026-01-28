import type { UpdateUserPayload, UserRepository } from "../ports/UserRepository";

export class UpdateUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(token: string, userId: number, payload: UpdateUserPayload) {
    return this.repo.updateUser(token, userId, payload);
  }
}
