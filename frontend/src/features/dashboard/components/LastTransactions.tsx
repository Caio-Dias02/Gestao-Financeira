import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Receipt,
  Plus
} from "lucide-react";

interface LastTransactionsProps {
    transactions: {
        id: string;
        title: string;
        amount: number;
        type: string;
        category?: string;
        date?: string;
    }[];
}

export function LastTransactions({ transactions }: LastTransactionsProps) {
    const hasTransactions = transactions && transactions.length > 0;
    
    return (
        <Card className="money-card border-0 shadow-financial">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Transações Recentes
                    </CardTitle>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {transactions?.length || 0} transações
                    </Badge>
                </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
                {!hasTransactions ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <Receipt className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="font-medium mb-2">Nenhuma transação encontrada</p>
                        <p className="text-sm text-gray-400 text-center mb-4">
                            Suas transações mais recentes aparecerão aqui
                        </p>
                        <Button size="sm" className="gap-2 bg-gradient-primary">
                            <Plus className="w-4 h-4" />
                            Nova Transação
                        </Button>
                    </div>
                ) : (
                    transactions.slice(0, 8).map((transaction, index) => {
                        // Safe access to transaction properties with fallbacks
                        const id = transaction?.id || `transaction-${index}`;
                        const title = transaction?.title || transaction?.name || 'Transação';
                        const amount = Number(transaction?.amount) || 0;
                        const type = transaction?.type || 'EXPENSE';
                        const category = transaction?.category;
                        const date = transaction?.date;
                        
                        const isIncome = type === "INCOME";
                        const isEven = index % 2 === 0;
                        
                        return (
                            <div 
                                key={id} 
                                className={`group p-4 rounded-xl transition-all duration-200 hover:shadow-md border ${
                                    isEven 
                                        ? 'bg-gradient-to-r from-white to-gray-50/50 border-gray-100' 
                                        : 'bg-white border-gray-100'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                                            isIncome 
                                                ? 'bg-green-100 text-green-600' 
                                                : 'bg-red-100 text-red-600'
                                        }`}>
                                            {isIncome ? (
                                                <ArrowUpRight className="w-5 h-5" />
                                            ) : (
                                                <ArrowDownLeft className="w-5 h-5" />
                                            )}
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <p className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                                                {String(title)}
                                            </p>
                                            {category && (
                                                <Badge variant="outline" className="text-xs font-normal">
                                                    {String(category)}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        <div className={`font-bold text-lg ${
                                            isIncome ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {isIncome ? '+' : '-'}{formatCurrency(Math.abs(amount))}
                                        </div>
                                        {date && (
                                            <p className="text-xs text-gray-500">
                                                {new Date(date).toLocaleDateString('pt-BR')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                
                {hasTransactions && transactions.length > 8 && (
                    <div className="pt-3 border-t border-gray-100">
                        <Button variant="ghost" className="w-full text-primary hover:bg-primary/10">
                            Ver todas as {transactions.length} transações
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
  