export type TransactionType = 'receita' | 'despesa';

export type Transaction = {
  id: string;
  titulo: string;
  valor: number;
  data: string;
  tipo: TransactionType;
  categoria: string;
  metodo?: string;
};

export type ChartData = {
  name: string;
  value: number;
  color: string;
};

export type DashboardData = {
  usuario: {
    nome: string;
  };
  resumoFinanceiro: {
    saldoAtual: number;
    receitas: number;
    despesas: number;
    balanco: number;
  };
  detalhamentoDespesas: {
    fixas: number;
    variaveis: number;
    cartaoCredito: number;
  };
  feedTransacoes: Transaction[];
  graficos: ChartData[];
};
