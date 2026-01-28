// src/types/creditCard.ts

export type CreditCardBrand = 
  | 'Visa'
  | 'Mastercard'
  | 'Elo'
  | 'American Express'
  | 'Hipercard'
  | 'Diners'
  | 'Discover'
  | 'Outro';

export type CreditCard = {
  uuid_cartao: string;
  nome: string;
  bandeira: CreditCardBrand | null;
  ultimos4: string | null;
  corHex: string | null;
  diaFechamento: number;
  diaVencimento: number;
  limite: number;
  limiteUsado: number;
  limiteDisponivel: number;
  percentualUsado: number;
  ativo?: boolean;
};

export type CreditCardDetails = {
  resumoCartao: {
    uuid_cartao: string;
    nome: string;
    bandeira: CreditCardBrand | null;
    ultimos4: string | null;
    corHex: string | null;
    limite: number;
    limiteUsado: number;
    limiteDisponivel: number;
    diaFechamento: number;
    diaVencimento: number;
    ativo: boolean;
  };
  porCategoria: Array<{
    categoria: string;
    valor: number;
  }>;
  parcelasAtivas: Array<{
    idLancamento: number;
    descricao: string;
    valorParcela: number;
    parcelaAtual: number;
    totalParcelas: number;
    parcelasPagas: number;
    restam: number;
  }>;
  gastosDoMes: {
    total: number;
    itens: Array<{
      idLancamento: number;
      descricao: string;
      categoria: string;
      dataCompra: string;
      valor: number;
      parcela: {
        atual: number;
        total: number;
      };
    }>;
  };
};

export type CreateCreditCardDTO = {
  nome: string;
  bandeira?: CreditCardBrand | null;
  ultimos4?: string | null;
  corHex?: string | null;
  limite: number;
  diaFechamento: number;
  diaVencimento: number;
};

export type EditCreditCardDTO = Partial<CreateCreditCardDTO>;

export type CreditCardsOverview = {
  periodo: {
    ano: number;
    mes: number;
  };
  cartoes: CreditCard[];
  cartaoSelecionadoUuid: string | null;
  detalhes: CreditCardDetails | null;
};

export type CreditCardTransaction = {
  idLancamento: number;
  descricao: string;
  categoria: string;
  dataCompra: string;
  valor: number;
  parcela: {
    atual: number;
    total: number;
  };
};

export type CreateTransactionDTO = {
  descricao: string;
  categoria?: string | null;
  valorTotal: number;
  dataCompra: string;
  parcelado: boolean;
  numeroParcelas?: number;
};

export type PayInvoiceDTO = {
  valorPagamento: number;
  ano: number;
  mes: number;
};

export type InvoicePaymentResponse = {
  mensagem: string;
  statusFatura: 'PAGA' | 'ABERTA' | 'VENCIDA';
  valorPago: number;
  restante: number;
};