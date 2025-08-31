import { Alert, AlertDescription } from "@/features/shared/components/ui/alert"
import { Button } from "@/features/shared/components/ui/button"
import { PageHeader } from "@/features/shared/components/ui/page-header"
import { LoadingState } from "@/features/shared/components/ui/loading-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card"
import { Badge } from "@/features/shared/components/ui/badge"
import { GraficoCard } from "../components/GraficoCard"
import { LastTransactions } from "../components/LastTransactions"
import { SummaryCard } from "../components/SummaryCard"
import { useDashboard } from "../hooks/useDashboard"
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpDown, 
  PiggyBank
} from "lucide-react"

export const DashboardPage = () => {
    const { summary, transactions, chartData, loading, error } = useDashboard();

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Dashboard" description="Visão geral das suas finanças" />
                <LoadingState type="page" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <PageHeader title="Dashboard" description="Visão geral das suas finanças" />
                <Alert variant="destructive">
                    <AlertDescription>
                        Erro ao carregar dashboard: {error}
                    </AlertDescription>
                </Alert>
                <div className="flex justify-center">
                    <Button onClick={() => window.location.reload()} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Tentar Novamente
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600 text-lg">Visão geral completa das suas finanças pessoais</p>
            </div>

            {/* Main Stats Grid - Melhor organização responsiva */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <SummaryCard 
                    title="Saldo Total" 
                    amount={summary?.netWorth || 0} 
                    variant="success"
                    icon={<Wallet className="h-5 w-5" />}
                    trend={summary?.netWorthChange ? {
                        value: summary.netWorthChange,
                        isPositive: summary.netWorthChange >= 0
                    } : undefined}
                    className="col-span-1"
                />
                <SummaryCard 
                    title="Receitas do Mês" 
                    amount={summary?.monthlyIncome || 0} 
                    variant="success"
                    icon={<TrendingUp className="h-5 w-5" />}
                    trend={summary?.monthlyIncomeChange ? {
                        value: summary.monthlyIncomeChange,
                        isPositive: summary.monthlyIncomeChange >= 0
                    } : undefined}
                />
                <SummaryCard 
                    title="Despesas do Mês" 
                    amount={summary?.monthlyExpenses || 0} 
                    variant="warning"
                    icon={<ArrowUpDown className="h-5 w-5" />}
                    trend={summary?.monthlyExpensesChange ? {
                        value: summary.monthlyExpensesChange,
                        isPositive: summary.monthlyExpensesChange >= 0
                    } : undefined}
                />
                <SummaryCard 
                    title="Economia do Mês" 
                    amount={summary?.monthlyBalance || 0} 
                    variant="default"
                    icon={<PiggyBank className="h-5 w-5" />}
                    trend={summary?.monthlySavingsChange ? {
                        value: summary.monthlySavingsChange,
                        isPositive: summary.monthlySavingsChange >= 0
                    } : undefined}
                />
            </div>


            {/* Charts and Data Section - Grid melhorado */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Gráfico Principal - Ocupa 2 colunas no desktop */}
                <div className="xl:col-span-2">
                    <GraficoCard data={chartData || []} />
                </div>

                {/* Transações Recentes - 1 coluna */}
                <div>
                    <LastTransactions transactions={transactions || []} />
                </div>
            </div>

        </div>
    )
}