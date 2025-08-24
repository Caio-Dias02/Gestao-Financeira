import { Skeleton } from "@/features/shared/components/ui/skeleton"
import { GraficoCard } from "../components/GraficoCard"
import { LastTransactions } from "../components/LastTransactions"
import { SummaryCard } from "../components/SummaryCard"
import { useDashboard } from "../hooks/useDashboard"

export const DashboardPage = () => {
    const { summary, transactions, chartData, loading, error } = useDashboard();

    if (loading) {
        return (
            <div className="flex flex-col gap-4 p-4">
                <Skeleton className="h-8 w-1/3 mx-auto" />
                <div className="grid grid-cols-3 gap-4 mt-4">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                </div>
                <Skeleton className="h-64 mt-4" />
                <div className="mt-4 space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 p-8">
                <div className="text-red-500 text-center">
                    <h2 className="text-xl font-semibold mb-2">Erro ao Carregar Dashboard</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold text-center">Dashboard</h1>
            <div className="flex flex-col gap-4">
                <SummaryCard title="Saldo Total" amount={summary?.netWorth || 0} color="text-green-600" />
                <SummaryCard title="Transações Mensais" amount={summary?.totalTransactions || 0} color="text-green-600" />
                <SummaryCard title="Variação Mensal" amount={summary?.monthlyChange || 0} color="text-green-600" />
            </div>
            <div className="flex flex-col gap-4">
                <GraficoCard data={chartData || []} />
                <LastTransactions transactions={transactions || []} />
            </div>
        </div>
    )
}