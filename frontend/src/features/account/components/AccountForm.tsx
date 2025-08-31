import { useState, useEffect } from "react";
import { type Account } from "../hooks/useAccounts";
import { Input } from "@/features/shared/components/ui/input";
import { Button } from "@/features/shared/components/ui/button";
import { Label } from "@/features/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { 
  CreditCard, 
  PiggyBank, 
  Wallet, 
  Building2, 
  TrendingUp,
  Loader2,
  Sparkles,
  DollarSign,
  Palette,
  Calculator,
  Banknote
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface AccountFormProps {
    account?: Account;
    onSubmit: (data: Partial<Account>) => void;
    isLoading?: boolean;
}

const accountTypes = [
    { value: "CHECKING", label: "Conta Corrente", icon: Building2, color: "bg-blue-100 text-blue-800" },
    { value: "SAVINGS", label: "Poupança", icon: PiggyBank, color: "bg-green-100 text-green-800" },
    { value: "CREDIT", label: "Cartão de Crédito", icon: CreditCard, color: "bg-purple-100 text-purple-800" },
    { value: "CASH", label: "Dinheiro", icon: Wallet, color: "bg-yellow-100 text-yellow-800" },
    { value: "INVESTMENT", label: "Investimento", icon: TrendingUp, color: "bg-indigo-100 text-indigo-800" },
];

const predefinedColors = [
    "#10B981", "#F59E0B", "#EF4444", "#3B82F6", 
    "#8B5CF6", "#F97316", "#06B6D4", "#84CC16",
    "#EC4899", "#6366F1", "#14B8A6", "#F43F5E",
    "#64748B", "#0F172A", "#7C2D12", "#365314"
];

export const AccountForm = ({ account, onSubmit, isLoading = false }: AccountFormProps) => {
    const [name, setName] = useState(account?.name || "");
    const [type, setType] = useState(account?.type || "CHECKING");
    const [balance, setBalance] = useState(account?.balance || 0);
    const [color, setColor] = useState(account?.color || "#10B981");
    const [icon, setIcon] = useState(account?.icon || "💳");

    // Atualizar campos quando account mudar (para modo de edição)
    useEffect(() => {
        if (account) {
            setName(account.name || "");
            setType(account.type || "CHECKING");
            setBalance(account.balance || 0);
            setColor(account.color || "#10B981");
            setIcon(account.icon || "💳");
        } else {
            // Reset para modo de criação
            setName("");
            setType("CHECKING");
            setBalance(0);
            setColor("#10B981");
            setIcon("💳");
        }
    }, [account]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = { name, type, balance: Number(balance), color, icon };
        console.log('🔍 [DEBUG] AccountForm.handleSubmit - Dados do formulário:', formData);
        onSubmit(formData);
        
        // Reset form se não estiver editando
        if (!account) {
            setName("");
            setType("CHECKING");
            setBalance(0);
            setColor("#10B981");
            setIcon("💳");
        }
    };

    const selectedAccountType = accountTypes.find(t => t.value === type);
    const IconComponent = selectedAccountType?.icon || Wallet;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Preview Card */}
            <Card className="money-card border-2 shadow-green">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div 
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-medium text-xl shadow-lg transition-all duration-200"
                            style={{ backgroundColor: color }}
                        >
                            {icon}
                        </div>
                        <div className="space-y-2 flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">
                                {name || "Nome da Conta"}
                            </h3>
                            <div className="flex items-center gap-3">
                                <Badge className={`text-xs font-medium ${selectedAccountType?.color || "bg-gray-100 text-gray-800"}`}>
                                    <IconComponent className="w-3 h-3 mr-1" />
                                    {selectedAccountType?.label || type}
                                </Badge>
                                <div className="text-xl font-bold text-green-600">
                                    {formatCurrency(Number(balance) || 0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Form Fields */}
            <div className="space-y-5">
                {/* Name Field */}
                <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Nome da Conta
                    </Label>
                    <Input
                        id="name"
                        placeholder="Ex: Conta Corrente Banco X, Carteira, Poupança..."
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="border-2 focus:border-primary transition-colors h-12"
                    />
                </div>

                {/* Type Field */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        Tipo de Conta
                    </Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="border-2 focus:border-primary h-12">
                            <SelectValue placeholder="Selecione o tipo de conta" />
                        </SelectTrigger>
                        <SelectContent>
                            {accountTypes.map((accountType) => {
                                const TypeIcon = accountType.icon;
                                return (
                                    <SelectItem key={accountType.value} value={accountType.value} className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <TypeIcon className="w-4 h-4 text-gray-600" />
                                            <span>{accountType.label}</span>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                {/* Balance Field */}
                <div className="space-y-2">
                    <Label htmlFor="balance" className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        Saldo Inicial
                    </Label>
                    <div className="relative">
                        <Input
                            id="balance"
                            type="number"
                            value={balance}
                            onChange={e => {
                                const value = Number(e.target.value);
                                setBalance(value);
                            }}
                            placeholder="0,00"
                            className="border-2 focus:border-primary transition-colors h-12 pl-12"
                            step="0.01"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            R$
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">
                        Digite o saldo atual da conta (pode ser negativo para dívidas)
                    </p>
                </div>

                {/* Color Selection */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-primary" />
                        Cor da Conta
                    </Label>
                    <div className="grid grid-cols-8 gap-2">
                        {predefinedColors.map((presetColor) => (
                            <button
                                key={presetColor}
                                type="button"
                                className={`w-10 h-10 rounded-xl border-2 transition-all duration-200 hover:scale-110 ${
                                    color === presetColor 
                                        ? 'border-gray-400 ring-2 ring-primary' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                style={{ backgroundColor: presetColor }}
                                onClick={() => setColor(presetColor)}
                                title={`Selecionar cor ${presetColor}`}
                            />
                        ))}
                    </div>
                    <Input
                        type="color"
                        value={color}
                        onChange={e => setColor(e.target.value)}
                        className="w-24 h-12 p-1 border-2"
                        title="Escolher cor personalizada"
                    />
                </div>

                {/* Icon Field */}
                <div className="space-y-2">
                    <Label htmlFor="icon" className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-primary" />
                        Ícone da Conta
                    </Label>
                    <div className="grid grid-cols-6 gap-2 mb-3">
                        {["💳", "🏦", "💰", "💵", "🪙", "💎", "📈", "💸", "🤑", "💲", "🏧", "📊"].map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 flex items-center justify-center text-lg ${
                                    icon === emoji 
                                        ? 'border-primary bg-primary/10' 
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                                onClick={() => setIcon(emoji)}
                                title={`Selecionar ícone ${emoji}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                    <Input
                        id="icon"
                        placeholder="Ou digite um emoji personalizado"
                        value={icon}
                        onChange={e => setIcon(e.target.value.slice(0, 2))}
                        maxLength={2}
                        className="text-center text-lg border-2 h-12"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200 text-white font-medium py-3 text-base shadow-green" 
                disabled={isLoading}
                size="lg"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                    </>
                ) : (
                    <>
                        <Calculator className="mr-2 h-4 w-4" />
                        {account ? "Atualizar Conta" : "Criar Conta"}
                    </>
                )}
            </Button>
        </form>
    );
};
