import { useQuery } from "@tanstack/react-query";
import { gerDashboardSummary, getMonthlyTrends, getRecentTransactions } from "../services/dashboardApi";

export const useDashboard = () => {
    // ✅ Query para dados do dashboard
    const { 
        data: summaryData, 
        isLoading: summaryLoading, 
        error: summaryError 
    } = useQuery({
        queryKey: ['dashboard', 'summary'],
        queryFn: gerDashboardSummary,
        staleTime: 2 * 60 * 1000, // 2 minutos
    });

    // ✅ Query para transações recentes
    const { 
        data: recentTransactions = [], 
        isLoading: transactionsLoading, 
        error: transactionsError 
    } = useQuery({
        queryKey: ['dashboard', 'recent-transactions'],
        queryFn: () => getRecentTransactions(5),
        staleTime: 1 * 60 * 1000, // 1 minuto
    });

    // ✅ Query para tendências mensais
    const { 
        data: monthlyTrends = [], 
        isLoading: trendsLoading, 
        error: trendsError 
    } = useQuery({
        queryKey: ['dashboard', 'monthly-trends'],
        queryFn: () => getMonthlyTrends(6),
        staleTime: 5 * 60 * 1000, // 5 minutos
    });

    // ✅ Estados consolidados
    const loading = summaryLoading || transactionsLoading || trendsLoading;
    const error = summaryError || transactionsError || trendsError;

    // ✅ Dados processados
    const summary = summaryData?.quickStats || null;
    const transactions = recentTransactions || [];
    const chartData = monthlyTrends?.map((d: any) => ({ 
        nome: d.month, 
        valor: d.balance || 0 
    })) || [];


    return { 
        summary, 
        transactions, 
        chartData, 
        loading, 
        error: error?.message || null 
    };
};
