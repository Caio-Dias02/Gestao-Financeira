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
        <Card className="group hover:shadow-financial hover:shadow-green transition-all duration-300 money-card border-0 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-full" />
            
            <CardContent className="p-5 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div 
                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-medium text-xl shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden"
                                style={{ backgroundColor: category.color }}
                            >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative z-10">{category.icon}</span>
                            </div>
                            {/* Glow effect */}
                            <div 
                                className="absolute inset-0 w-14 h-14 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md -z-10"
                                style={{ backgroundColor: category.color }}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <h3 className="font-bold text-gray-900 leading-none text-lg group-hover:text-primary transition-colors duration-200">
                                {category.name}
                            </h3>
                            <div className="flex items-center gap-2">
                                <Badge 
                                    variant={category.type === "INCOME" ? "default" : "secondary"}
                                    className={`text-xs font-medium ${
                                        category.type === "INCOME" 
                                            ? "bg-green-100 text-green-800 border-green-200" 
                                            : "bg-orange-100 text-orange-800 border-orange-200"
                                    }`}
                                >
                                    {category.type === "INCOME" ? "💰 Receita" : "💸 Despesa"}
                                </Badge>
                                {/* Color indicator */}
                                <div 
                                    className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                                    style={{ backgroundColor: category.color }}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-9 w-9 p-0 hover:bg-white/80 rounded-xl"
                            >
                                <MoreHorizontal className="h-4 w-4 text-gray-600" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 shadow-financial border-0 bg-white/95 backdrop-blur-md">
                            <DropdownMenuItem 
                                onClick={onEdit} 
                                className="cursor-pointer hover:bg-blue-50 text-blue-700 font-medium"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={onDelete} 
                                className="cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600 font-medium"
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                
                {/* Bottom decorative line */}
                <div 
                    className="absolute bottom-0 left-0 right-0 h-1 opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                    style={{ backgroundColor: category.color }}
                />
            </CardContent>
        </Card>
    );
};
