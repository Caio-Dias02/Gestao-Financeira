import { api } from '@/features/shared/services/api';

// Types
export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description?: string;
  date: string;
  categoryId?: string;
  accountId?: string;
  category?: {
    id: string;
    name: string;
    type: string;
    color: string;
    icon: string;
  };
  account?: {
    id: string;
    name: string;
    type: string;
  };
  createdAt: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: 'INCOME' | 'EXPENSE';
  categoryId?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: 'date' | 'amount' | 'title' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTransactionData {
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description?: string;
  date: string;
  categoryId?: string;
  accountId?: string;
}

export interface UpdateTransactionData {
  title?: string;
  amount?: number;
  type?: 'INCOME' | 'EXPENSE';
  description?: string;
  date?: string;
  categoryId?: string;
  accountId?: string;
}

export interface TransactionResponse {
  message: string;
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface SingleTransactionResponse {
  message: string;
  transaction: Transaction;
}

// API Functions
export const transacoesApi = {
  // Listar com filtros
  async getAll(filters?: TransactionFilters): Promise<TransactionResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.type) params.append('type', filters.type);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.accountId) params.append('accountId', filters.accountId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const queryString = params.toString();
    const url = `/transactions${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Buscar por ID
  async getById(id: string): Promise<SingleTransactionResponse> {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  // Criar transa��o
  async create(data: CreateTransactionData): Promise<SingleTransactionResponse> {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  // Atualizar transa��o
  async update(id: string, data: UpdateTransactionData): Promise<SingleTransactionResponse> {
    const response = await api.patch(`/transactions/${id}`, data);
    return response.data;
  },

  // Excluir transa��o
  async delete(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  // Filtros espec�ficos (para compatibilidade)
  async getByCategory(categoryId: string): Promise<TransactionResponse> {
    const response = await api.get(`/transactions/category/${categoryId}`);
    return response.data;
  },

  async getByAccount(accountId: string): Promise<TransactionResponse> {
    const response = await api.get(`/transactions/account/${accountId}`);
    return response.data;
  },

  async getByDateRange(startDate: string, endDate: string): Promise<TransactionResponse> {
    const response = await api.get(`/transactions/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },
};