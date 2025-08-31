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
  RefreshCw,
  Sparkles,
  Plus,
  Minus,
  CreditCard,
  FileText,
  BarChart3,
  Clock,
  PiggyBank,
  Coins
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
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600 text-lg">Visão geral completa das suas finanças pessoais</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Atualizar
                    </Button>
                    <Button className="bg-gradient-primary hover:opacity-90 shadow-green gap-2" size="sm">
                        <Plus className="h-4 w-4" />
                        Nova Transação
                    </Button>
                </div>
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

            {/* Quick Actions - Layout melhorado */}
            <div className="bg-gradient-to-br from-white via-white to-primary/5 rounded-3xl p-6 border border-primary/10 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        Ações Rápidas
                    </h3>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                        4 ações disponíveis
                    </Badge>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button 
                        variant="outline" 
                        className="h-24 flex-col gap-3 hover:bg-primary/10 hover:border-primary hover:scale-105 transition-all duration-200 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Plus className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium">Nova Receita</span>
                    </Button>
                    <Button 
                        variant="outline" 
                        className="h-24 flex-col gap-3 hover:bg-red-50 hover:border-red-300 hover:scale-105 transition-all duration-200 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <Minus className="h-5 w-5 text-red-500" />
                        </div>
                        <span className="text-sm font-medium">Nova Despesa</span>
                    </Button>
                    <Button 
                        variant="outline" 
                        className="h-24 flex-col gap-3 hover:bg-blue-50 hover:border-blue-300 hover:scale-105 transition-all duration-200 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <CreditCard className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className="text-sm font-medium">Nova Conta</span>
                    </Button>
                    <Button 
                        variant="outline" 
                        className="h-24 flex-col gap-3 hover:bg-purple-50 hover:border-purple-300 hover:scale-105 transition-all duration-200 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                            <FileText className="h-5 w-5 text-purple-500" />
                        </div>
                        <span className="text-sm font-medium">Relatório</span>
                    </Button>
                </div>
            </div>

            {/* Charts and Data Section - Grid melhorado */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Gráfico Principal - Ocupa 2 colunas no desktop */}
                <div className="xl:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <BarChart3 className="h-6 w-6 text-primary" />
                            Evolução Financeira
                        </h3>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">7 dias</Button>
                            <Button variant="outline" size="sm">30 dias</Button>
                            <Button variant="default" size="sm" className="bg-primary">3 meses</Button>
                        </div>
                    </div>
                    <GraficoCard data={chartData || []} />
                </div>

                {/* Transações Recentes - 1 coluna */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Clock className="h-6 w-6 text-primary" />
                            Recentes
                        </h3>
                        <Button variant="ghost" size="sm" className="text-primary">
                            Ver todas
                        </Button>
                    </div>
                    <LastTransactions transactions={transactions || []} />
                </div>
            </div>

            {/* Bottom Section - Insights e Metas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="money-card border-0 shadow-financial">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Insights Financeiros
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-green-800">Economia crescendo!</p>
                                    <p className="text-xs text-green-600">+18% este mês</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <PiggyBank className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-blue-800">Meta de R$ 10.000</p>
                                    <p className="text-xs text-blue-600">Faltam R$ 2.450</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="money-card border-0 shadow-financial">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Coins className="h-5 w-5 text-primary" />
                            Distribuição por Categoria
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm">Alimentação</span>
                                </div>
                                <span className="text-sm font-medium">R$ 1.200</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-sm">Transporte</span>
                                </div>
                                <span className="text-sm font-medium">R$ 800</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                    <span className="text-sm">Lazer</span>
                                </div>
                                <span className="text-sm font-medium">R$ 600</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}