import { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { CategoryCard } from "../components/CategoryCard";
import { CategoryForm } from "../components/CategoryForm";
import { Skeleton } from "@/features/shared/components/ui/skeleton";

export const CategoriesPage = () => {
    const {
        categories,
        isLoading,
        error,
        createCategory,
        updateCategory,
        deleteCategory,
    } = useCategories();

    const [editing, setEditing] = useState<string | null>(null);

    if (isLoading) return <Skeleton className="h-10 w-full" />;

    if (error) return <div className="text-red-500 text-center">Erro ao carregar categorias: {error.message}</div>;

    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-center">Gerenciamento de Categorias</h1>

            <div className="max-w-md mx-auto">
                <CategoryForm
                    category={categories.find((c: any) => c.id === editing) || undefined}
                    isLoading={createCategory.isPending || updateCategory.isPending}
                    onSubmit={data => {
                        if (editing) {
                            updateCategory.mutate({ id: editing, data });
                        } else {
                            createCategory.mutate(data);
                        }
                    }}
                />
            </div>

            {categories.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                    Nenhuma categoria encontrada. Crie sua primeira categoria acima.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {categories.map((category: any) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onEdit={() => setEditing(category.id)}
                            onDelete={() => {
                                deleteCategory.mutate(category.id);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
