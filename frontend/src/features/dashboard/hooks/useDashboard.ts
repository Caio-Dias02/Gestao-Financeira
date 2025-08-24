import { useQuery } from '@tanstack/react-query';
import { DashboardApi } from '../services/dashboardApi';
import { DashboardFiltersDto, BalanceHistoryDto } from '../types/dashboard.types';

export const useDashboard = () => {
  // Hook para resumo completo do dashboard
  const useDashboardSummary = () => {
    return useQuery({
      queryKey: ['dashboard', 'summary'],
      queryFn: () => DashboardApi.getSummary(),
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
    });
  };

  // Hook para visão geral financeira
  const useOverview = (filters: DashboardFiltersDto = {}) => {
    return useQuery({
      queryKey: ['dashboard', 'overview', filters],
      queryFn: () => DashboardApi.getOverview(filters),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });
  };

  // Hook para breakdown por categorias
  const useCategoryBreakdown = (filters: DashboardFiltersDto = {}) => {
    return useQuery({
      queryKey: ['dashboard', 'categories', filters],
      queryFn: () => DashboardApi.getCategoryBreakdown(filters),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });
  };

  // Hook para saldos das contas
  const useAccountBalances = () => {
    return useQuery({
      queryKey: ['dashboard', 'accounts'],
      queryFn: () => DashboardApi.getAccountBalances(),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });
  };

  // Hook para histórico de saldos
  const useBalanceHistory = (filters: BalanceHistoryDto = {}) => {
    return useQuery({
      queryKey: ['dashboard', 'balance-history', filters],
      queryFn: () => DashboardApi.getBalanceHistory(filters),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });
  };

  // Hook para transações recentes
  const useRecentTransactions = (limit: number = 10) => {
    return useQuery({
      queryKey: ['dashboard', 'recent-transactions', limit],
      queryFn: () => DashboardApi.getRecentTransactions(limit),
      staleTime: 2 * 60 * 1000, // 2 minutos (mais frequente)
      refetchOnWindowFocus: false,
    });
  };

  // Hook para tendências mensais
  const useMonthlyTrends = (months: number = 6) => {
    return useQuery({
      queryKey: ['dashboard', 'monthly-trends', months],
      queryFn: () => DashboardApi.getMonthlyTrends(months),
      staleTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
    });
  };

  return {
    useDashboardSummary,
    useOverview,
    useCategoryBreakdown,
    useAccountBalances,
    useBalanceHistory,
    useRecentTransactions,
    useMonthlyTrends,
  };
};
