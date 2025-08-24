import { Card, CardTitle } from "@/features/shared/components/ui/card";
import { Trash, Edit } from "lucide-react";

interface CategoryCardProps {
    category: {
        id: string;
        name: string;
        type: "INCOME" | "EXPENSE";
        color: string;
        icon: string;
    };
    onEdit: () => void;
    onDelete: () => void;
}

export const CategoryCard = ({ category, onEdit, onDelete }: CategoryCardProps) => {
    return (
        <Card className="flex justify-between items-center p-4">
            <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center`} style={{ backgroundColor: category.color }}>
                    {category.icon}
                </div>
                <div>
                    <CardTitle className="text-lg font-bold">{category.name}</CardTitle>
                    <p className="text-sm text-gray-500">{category.type === "INCOME" ? "Receita" : "Despesa"}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={onEdit} className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                <button onClick={onDelete} className="text-red-500 hover:text-red-700"><Trash size={18} /></button>
            </div>
        </Card>
    );
};
