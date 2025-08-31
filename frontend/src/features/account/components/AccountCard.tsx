import { type Account } from "../hooks/useAccounts";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/features/shared/components/ui/dropdown-menu";
import { 
  Edit, 
  Trash, 
  MoreHorizontal, 
  CreditCard, 
  PiggyBank, 
  Wallet, 
  Banknote,
  TrendingUp,
  Building2,
  Coins
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface AccountCardProps {
    account: Account;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
}

const accountTypeIcons = {
    CHECKING: Building2,
    SAVINGS: PiggyBank,
    CREDIT: CreditCard,
    CASH: Wallet,
    INVESTMENT: TrendingUp,
};

const accountTypeLabels = {
    CHECKING: "Conta Corrente",
    SAVINGS: "Poupança",
    CREDIT: "Cartão de Crédito", 
    CASH: "Dinheiro",
    INVESTMENT: "Investimento",
};

const accountTypeColors = {
    CHECKING: "bg-blue-100 text-blue-800 border-blue-200",
    SAVINGS: "bg-green-100 text-green-800 border-green-200",
    CREDIT: "bg-purple-100 text-purple-800 border-purple-200",
    CASH: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    INVESTMENT: "bg-indigo-100 text-indigo-800 border-indigo-200",
};

export const AccountCard = ({ account, onEdit, onDelete, isDeleting = false }: AccountCardProps) => {
    const IconComponent = accountTypeIcons[account.type as keyof typeof accountTypeIcons] || Wallet;
    const typeLabel = accountTypeLabels[account.type as keyof typeof accountTypeLabels] || account.type;
    const typeColorClass = accountTypeColors[account.type as keyof typeof accountTypeColors] || "bg-gray-100 text-gray-800 border-gray-200";
    
    const balance = account.balance || 0;
    const isPositive = balance > 0;
    const isNegative = balance < 0;

    return (
        <Card className="group hover:shadow-financial transition-all duration-300 money-card border-0 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full" />
            
            {/* Balance indicator line */}
            <div 
                className={`absolute top-0 left-0 right-0 h-1 ${
                    isPositive ? 'bg-green-500' : isNegative ? 'bg-red-500' : 'bg-gray-300'
                } opacity-60`}
            />
            
            <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div 
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden"
                                style={{ backgroundColor: account.color || '#2B8A3E' }}
                            >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <IconComponent className="w-6 h-6 relative z-10" />
                            </div>
                            {/* Glow effect */}
                            <div 
                                className="absolute inset-0 w-12 h-12 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-lg -z-10"
                                style={{ backgroundColor: account.color || '#2B8A3E' }}
                            />
                        </div>
                        
                        <div className="space-y-1">
                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors duration-200">
                                {account.name}
                            </h3>
                            <Badge className={`text-xs font-medium ${typeColorClass}`}>
                                {typeLabel}
                            </Badge>
                        </div>
                    </div>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0 hover:bg-white/80 rounded-lg"
                                disabled={isDeleting}
                            >
                                <MoreHorizontal className="h-4 w-4 text-gray-600" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36 shadow-financial border-0 bg-white/95 backdrop-blur-md">
                            <DropdownMenuItem 
                                onClick={() => onEdit(account.id)} 
                                className="cursor-pointer hover:bg-blue-50 text-blue-700 font-medium"
                                disabled={isDeleting}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => onDelete(account.id)} 
                                className="cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600 font-medium"
                                disabled={isDeleting}
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                {isDeleting ? "Excluindo..." : "Excluir"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Balance Display */}
                <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Saldo atual</span>
                        {balance !== 0 && (
                            <div className={`flex items-center text-xs font-medium ${
                                isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                                <span>{isPositive ? '↗' : '↘'}</span>
                                <span className="ml-1">{isPositive ? 'Positivo' : 'Negativo'}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className={`text-2xl font-bold ${
                        isPositive ? 'text-green-600' : 
                        isNegative ? 'text-red-600' : 
                        'text-gray-600'
                    }`}>
                        {formatCurrency(balance)}
                    </div>

                    {/* Progress bar for visualization */}
                    {balance !== 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    isPositive ? 'bg-green-500' : 'bg-red-500'
                                }`}
                                style={{ 
                                    width: `${Math.min(Math.abs(balance) / 10000 * 100, 100)}%` 
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Account color indicator */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: account.color || '#2B8A3E' }}
                        />
                        <span className="text-xs text-gray-500">Cor da conta</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs text-gray-500">{account.type}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
