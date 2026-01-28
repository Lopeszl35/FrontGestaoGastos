import type { UserRepository, UserSaldo } from "../ports/UserRepository";

export class UpdateUserSaldoUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(token: string, saldoAtual: number): Promise<UserSaldo> {
    return this.repo.updateUserSaldo(token, saldoAtual);
  }
}
