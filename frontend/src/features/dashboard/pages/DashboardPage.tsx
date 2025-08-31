import { Alert, AlertDescription } from "@/features/shared/components/ui/alert"
import { Button } from "@/features/shared/components/ui/button"
import { PageHeader } from "@/features/shared/components/ui/page-header"
import { LoadingState } from "@/features/shared/components/ui/loading-state"
import { GraficoCard } from "../components/GraficoCard"
import { LastTransactions } from "../components/LastTransactions"
import { SummaryCard } from "../components/SummaryCard"
import { useDashboard } from "../hooks/useDashboard"
import { Wallet, TrendingUp, ArrowUpDown, RefreshCw } from "lucide-react"

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
            <PageHeader 
                title="Dashboard" 
                description="Visão geral das suas finanças pessoais"
            />
            
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <SummaryCard 
                    title="Saldo Total" 
                    amount={summary?.netWorth || 0} 
                    variant="success"
                    icon={<Wallet className="h-4 w-4" />}
                    trend={{
                        value: summary?.netWorthChange || 0,
                        isPositive: (summary?.netWorthChange || 0) >= 0
                    }}
                />
                <SummaryCard 
                    title="Receitas do Mês" 
                    amount={summary?.monthlyIncome || 0} 
                    variant="success"
                    icon={<TrendingUp className="h-4 w-4" />}
                />
                <SummaryCard 
                    title="Despesas do Mês" 
                    amount={summary?.monthlyExpenses || 0} 
                    variant="danger"
                    icon={<ArrowUpDown className="h-4 w-4" />}
                />
            </div>

            {/* Charts and Transactions */}
            <div className="grid gap-6 lg:grid-cols-2">
                <GraficoCard data={chartData || []} />
                <LastTransactions transactions={transactions || []} />
            </div>
        </div>
    )
}