import { useState, useEffect } from "react";
import { Input } from "@/features/shared/components/ui/input";
import { Button } from "@/features/shared/components/ui/button";
import { Label } from "@/features/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { 
  Palette, 
  Loader2, 
  Sparkles,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Coins,
  Banknote,
  CreditCard,
  Wallet,
  PiggyBank
} from "lucide-react";

interface CategoryFormProps {
    category?: {
        name: string;
        type: "INCOME" | "EXPENSE";
        color: string;
        icon: string;
    };
    onSubmit: (data: { name: string; type: "INCOME" | "EXPENSE"; color: string; icon: string }) => void;
    isLoading?: boolean;
}

const predefinedColors = [
    "#10B981", "#F59E0B", "#EF4444", "#3B82F6", 
    "#8B5CF6", "#F97316", "#06B6D4", "#84CC16",
    "#EC4899", "#6366F1", "#14B8A6", "#F43F5E"
];

const moneyIcons = [
    "💰", "💵", "💸", "💳", "🏦", "📈", 
    "📉", "🪙", "💴", "💶", "💷", "💎",
    "🤑", "💲", "🏧", "📊", "💹", "🎯"
];

export const CategoryForm = ({ category, onSubmit, isLoading }: CategoryFormProps) => {
    const [name, setName] = useState(category?.name || "");
    const [type, setType] = useState<"INCOME" | "EXPENSE">(category?.type || "INCOME");
    const [color, setColor] = useState(category?.color || "#10B981");
    const [icon, setIcon] = useState(category?.icon || "💰");

    useEffect(() => {
        if (category) {
            setName(category.name);
            setType(category.type);
            setColor(category.color);
            setIcon(category.icon);
        } else {
            // Reset form when no category is provided
            setName("");
            setType("INCOME");
            setColor("#10B981");
            setIcon("💰");
        }
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, type, color, icon });
        
        // Don't reset if editing
        if (!category) {
            setName("");
            setType("INCOME");
            setColor("#10B981");
            setIcon("💰");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Preview Card */}
            <Card className="money-card border-2 shadow-green">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-medium text-xl shadow-lg transition-all duration-200"
                            style={{ backgroundColor: color }}
                        >
                            {icon}
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-gray-900">
                                {name || "Nome da Categoria"}
                            </h3>
                            <Badge 
                                variant={type === "INCOME" ? "default" : "secondary"}
                                className="text-xs"
                            >
                                {type === "INCOME" ? (
                                    <>
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        Receita
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown className="w-3 h-3 mr-1" />
                                        Despesa
                                    </>
                                )}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Nome da Categoria
                    </Label>
                    <Input
                        id="name"
                        placeholder="Ex: Salário, Alimentação, Transporte..."
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="border-2 focus:border-primary transition-colors"
                    />
                </div>

                {/* Type Field */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        Tipo de Categoria
                    </Label>
                    <Select value={type} onValueChange={(val) => setType(val as "INCOME" | "EXPENSE")}>
                        <SelectTrigger className="border-2 focus:border-primary">
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INCOME" className="font-medium">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span>Receita</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="EXPENSE" className="font-medium">
                                <div className="flex items-center gap-2">
                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                    <span>Despesa</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Color Selection */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-primary" />
                        Cor da Categoria
                    </Label>
                    <div className="grid grid-cols-6 gap-2">
                        {predefinedColors.map((presetColor) => (
                            <button
                                key={presetColor}
                                type="button"
                                className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
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
                        className="w-20 h-10 p-1 border-2"
                        title="Escolher cor personalizada"
                    />
                </div>

                {/* Icon Selection */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-primary" />
                        Ícone da Categoria
                    </Label>
                    <div className="grid grid-cols-6 gap-2">
                        {moneyIcons.map((presetIcon) => (
                            <button
                                key={presetIcon}
                                type="button"
                                className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 flex items-center justify-center text-lg ${
                                    icon === presetIcon 
                                        ? 'border-primary bg-primary/10' 
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                                onClick={() => setIcon(presetIcon)}
                                title={`Selecionar ícone ${presetIcon}`}
                            >
                                {presetIcon}
                            </button>
                        ))}
                    </div>
                    <Input
                        placeholder="Ou digite um emoji personalizado"
                        value={icon}
                        onChange={e => setIcon(e.target.value.slice(0, 2))}
                        maxLength={2}
                        className="text-center text-lg border-2"
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
                        <Sparkles className="mr-2 h-4 w-4" />
                        {category ? "Atualizar" : "Criar"} Categoria
                    </>
                )}
            </Button>
        </form>
    );
};
