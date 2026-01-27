// src/services/creditCardsService.ts

import { httpRequest } from '../shared/http/httpClient';
import type { 
  CreditCardsOverview, 
  CreateCreditCardDTO, 
  EditCreditCardDTO, 
  CreditCard,
  CreateTransactionDTO 
} from '../types/creditCard';

class CreditCardsService {
  async getCardsOverview(
    userId: number,
    ano: number,
    mes: number,
    cartaoUuid?: string,
    token?: string
  ): Promise<CreditCardsOverview> {
    const params = new URLSearchParams({
      ano: ano.toString(),
      mes: mes.toString(),
      ...(cartaoUuid && { cartao_uuid: cartaoUuid }),
    });

    return httpRequest<CreditCardsOverview>(
      'GET',
      `/api/getCartoesVisaoGeral/${userId}?${params}`,
      undefined,
      token
    );
  }

  async getAllCards(userId: number, token?: string): Promise<CreditCard[]> {
    return httpRequest<CreditCard[]>(
      'GET',
      `/api/cartoes/${userId}`,
      undefined,
      token
    );
  }

  async createCard(
    userId: number,
    cardData: CreateCreditCardDTO,
    token?: string
  ): Promise<CreditCard> {
    return httpRequest<CreditCard>(
      'POST',
      `/api/criarCartao/${userId}`,
      cardData,
      token
    );
  }

  async editCard(
    userId: number,
    cardUuid: string,
    cardData: EditCreditCardDTO,
    token?: string
  ): Promise<CreditCard> {
    return httpRequest<CreditCard>(
      'PUT',
      `/api/editarCartoes/${userId}/${cardUuid}`,
      cardData,
      token
    );
  }

  async toggleCardStatus(
    userId: number,
    cardUuid: string,
    ativar: boolean,
    token?: string
  ): Promise<{ ativo: boolean }> {
    return httpRequest<{ ativo: boolean }>(
      'PATCH',
      `/api/cartoes/${userId}/${cardUuid}/ativar?ativo=${ativar}`,
      undefined,
      token
    );
  }

  async createTransaction(
    userId: number,
    cardUuid: string,
    transactionData: CreateTransactionDTO,
    token?: string
  ): Promise<any> {
    return httpRequest<any>(
      'POST',
      `/api/cartoes/${userId}/${cardUuid}/lancamentos`,
      transactionData,
      token
    );
  }

  async deleteCard(
    userId: number,
    cardUuid: string,
    token?: string
  ): Promise<void> {
    return httpRequest<void>(
      'DELETE',
      `/api/cartoes/${userId}/${cardUuid}`,
      undefined,
      token
    );
  }

  async payInvoice(
    userId: number,
    cardUuid: string,
    valorPagamento: number,
    ano: number,
    mes: number,
    token?: string
  ): Promise<any> {
    return httpRequest<any>(
      'POST',
      `/api/cartoes/${userId}/${cardUuid}/pagarFatura`,
      { valorPagamento, ano, mes },
      token
    );
  }
}

export const creditCardsService = new CreditCardsService();