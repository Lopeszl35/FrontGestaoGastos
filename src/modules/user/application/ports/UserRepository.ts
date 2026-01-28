export type UserSaldo = {
  saldo_atual: number;
};

export type UpdateUserPayload = {
  nome?: string;
  perfil_financeiro?: string;
};

export interface UserRepository {
  getUserSaldo: (token: string) => Promise<UserSaldo>;
  updateUserSaldo: (token: string, saldoAtual: number) => Promise<UserSaldo>;
  updateUser: (
    token: string,
    userId: number,
    payload: UpdateUserPayload
  ) => Promise<any>;
}
