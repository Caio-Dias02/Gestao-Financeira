import { useState, useEffect } from "react";
import { Input } from "@/features/shared/components/ui/input";
import { Button } from "@/features/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select";

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

export const CategoryForm = ({ category, onSubmit, isLoading }: CategoryFormProps) => {
    const [name, setName] = useState(category?.name || "");
    const [type, setType] = useState<"INCOME" | "EXPENSE">(category?.type || "INCOME");
    const [color, setColor] = useState(category?.color || "#34D399");
    const [icon, setIcon] = useState(category?.icon || "💰");

    useEffect(() => {
        if (category) {
            setName(category.name);
            setType(category.type);
            setColor(category.color);
            setIcon(category.icon);
        }
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, type, color, icon });
        setName("");
        setType("INCOME");
        setColor("#34D399");
        setIcon("💰");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border rounded-md">
            <Input
                placeholder="Nome da categoria"
                value={name}
                onChange={e => setName(e.target.value)}
                required
            />

            <Select value={type} onValueChange={(val) => setType(val as "INCOME" | "EXPENSE")}>
                <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="INCOME">Receita</SelectItem>
                    <SelectItem value="EXPENSE">Despesa</SelectItem>
                </SelectContent>
            </Select>

            <Input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                title="Cor da categoria"
            />

            <Input
                placeholder="Ícone"
                value={icon}
                onChange={e => setIcon(e.target.value)}
                maxLength={2}
            />

            <Button type="submit" className="mt-2" disabled={isLoading}>
                {category ? "Atualizar" : "Criar"} Categoria
            </Button>
        </form>
    );
};
