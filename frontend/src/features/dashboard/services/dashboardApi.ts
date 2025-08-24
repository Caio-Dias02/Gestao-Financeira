import { DashboardFiltersDto, BalanceHistoryDto } from '../types/dashboard.types';

const API_BASE_URL = 'http://localhost:3001';

export class DashboardApi {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Busca o token JWT do localStorage
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Endpoint principal que retorna resumo completo
  static async getSummary(): Promise<any> {
    return this.request('/dashboard/summary');
  }

  // Visão geral financeira
  static async getOverview(filters: DashboardFiltersDto = {}): Promise<any> {
    const params = new URLSearchParams();
    
    if (filters.period) params.append('period', filters.period);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.accountId) params.append('accountId', filters.accountId);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    
    const queryString = params.toString();
    const endpoint = `/dashboard/overview${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  // Breakdown por categorias
  static async getCategoryBreakdown(filters: DashboardFiltersDto = {}): Promise<any> {
    const params = new URLSearchParams();
    
    if (filters.period) params.append('period', filters.period);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.accountId) params.append('accountId', filters.accountId);
    
    const queryString = params.toString();
    const endpoint = `/dashboard/categories${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  // Saldos das contas
  static async getAccountBalances(): Promise<any> {
    return this.request('/dashboard/accounts');
  }

  // Histórico de saldos
  static async getBalanceHistory(filters: BalanceHistoryDto = {}): Promise<any> {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.accountId) params.append('accountId', filters.accountId);
    
    const queryString = params.toString();
    const endpoint = `/dashboard/balance-history${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  // Transações recentes
  static async getRecentTransactions(limit: number = 10): Promise<any> {
    return this.request(`/dashboard/recent-transactions?limit=${limit}`);
  }

  // Tendências mensais
  static async getMonthlyTrends(months: number = 6): Promise<any> {
    return this.request(`/dashboard/monthly-trends?months=${months}`);
  }
}
