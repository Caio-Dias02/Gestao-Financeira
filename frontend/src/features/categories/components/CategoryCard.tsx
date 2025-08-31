import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/features/shared/components/ui/dropdown-menu";
import { Trash, Edit, MoreHorizontal } from "lucide-react";

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
        <Card className="group hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium shadow-sm"
                            style={{ backgroundColor: category.color }}
                        >
                            {category.icon}
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-gray-900 leading-none">
                                {category.name}
                            </h3>
                            <Badge 
                                variant={category.type === "INCOME" ? "default" : "secondary"}
                                className="text-xs"
                            >
                                {category.type === "INCOME" ? "Receita" : "Despesa"}
                            </Badge>
                        </div>
                    </div>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={onDelete} 
                                className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
};
