// Enums
export enum DashboardPeriod {
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  CUSTOM = 'custom'
}

// DTOs para filtros
export interface DashboardFiltersDto {
  period?: DashboardPeriod;
  startDate?: string;
  endDate?: string;
  accountId?: string;
  categoryId?: string;
  includeTransfers?: boolean;
}

export interface BalanceHistoryDto {
  startDate?: string;
  endDate?: string;
  accountId?: string;
}

// Tipos de resposta da API
export interface DashboardOverview {
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    totalTransactions: number;
    incomeCount: number;
    expenseCount: number;
  };
}

export interface CategoryBreakdown {
  period: {
    start: string;
    end: string;
  };
  expenses: Array<{
    categoryId: string;
    category: {
      id: string;
      name: string;
      color: string;
      icon: string;
      type: string;
    } | null;
    amount: number;
    count: number;
  }>;
  income: Array<{
    categoryId: string;
    category: {
      id: string;
      name: string;
      color: string;
      icon: string;
      type: string;
    } | null;
    amount: number;
    count: number;
  }>;
}

export interface AccountBalance {
  id: string;
  name: string;
  type: string;
  balance: number;
  color: string;
  icon: string;
  monthChange: number;
  transactionCount: number;
}

export interface AccountBalances {
  accounts: AccountBalance[];
  summary: {
    totalBalance: number;
    totalMonthChange: number;
    accountCount: number;
  };
}

export interface BalanceHistory {
  period: {
    start: string;
    end: string;
  };
  balances: Array<{
    date: string;
    dailyChange: number;
    cumulativeBalance: number;
  }>;
}

export interface RecentTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  date: string;
  category: {
    id: string;
    name: string;
    color: string;
    icon: string;
  } | null;
  account: {
    id: string;
    name: string;
    type: string;
  } | null;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface DashboardSummary {
  overview: DashboardOverview;
  accounts: {
    totalBalance: number;
    totalMonthChange: number;
    accountCount: number;
  };
  recentTransactions: RecentTransaction[];
  quickStats: {
    totalAccounts: number;
    totalTransactions: number;
    netWorth: number;
    monthlyChange: number;
  };
}
