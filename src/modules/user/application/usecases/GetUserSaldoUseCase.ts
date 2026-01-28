import type { UserRepository, UserSaldo } from "../ports/UserRepository";

export class GetUserSaldoUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(token: string): Promise<UserSaldo> {
    return this.repo.getUserSaldo(token);
  }
}
