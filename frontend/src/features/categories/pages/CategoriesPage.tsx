import { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { CategoryCard } from "../components/CategoryCard";
import { CategoryForm } from "../components/CategoryForm";
import { PageHeader } from "@/features/shared/components/ui/page-header";
import { LoadingState } from "@/features/shared/components/ui/loading-state";
import { EmptyState } from "@/features/shared/components/ui/empty-state";
import { Alert, AlertDescription } from "@/features/shared/components/ui/alert";
import { Button } from "@/features/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shared/components/ui/dialog";
import { Plus, Tag } from "lucide-react";

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
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleSubmit = (data: any) => {
        if (editing) {
            updateCategory.mutate({ id: editing, data }, {
                onSuccess: () => {
                    setEditing(null);
                    setDialogOpen(false);
                }
            });
        } else {
            createCategory.mutate(data, {
                onSuccess: () => {
                    setDialogOpen(false);
                }
            });
        }
    };

    const handleEdit = (categoryId: string) => {
        setEditing(categoryId);
        setDialogOpen(true);
    };

    const handleNewCategory = () => {
        setEditing(null);
        setDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Categorias" description="Gerencie suas categorias de receitas e despesas" />
                <LoadingState type="grid" count={6} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <PageHeader title="Categorias" description="Gerencie suas categorias de receitas e despesas" />
                <Alert variant="destructive">
                    <AlertDescription>
                        Erro ao carregar categorias: {error.message}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Categorias" 
                description="Organize suas receitas e despesas em categorias personalizadas"
            >
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleNewCategory}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Categoria
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editing ? "Editar Categoria" : "Nova Categoria"}
                            </DialogTitle>
                        </DialogHeader>
                        <CategoryForm
                            category={categories.find((c: any) => c.id === editing)}
                            isLoading={createCategory.isPending || updateCategory.isPending}
                            onSubmit={handleSubmit}
                        />
                    </DialogContent>
                </Dialog>
            </PageHeader>

            {categories.length === 0 ? (
                <EmptyState
                    icon={<Tag className="h-12 w-12" />}
                    title="Nenhuma categoria encontrada"
                    description="Comece criando sua primeira categoria para organizar suas finanças."
                    action={{
                        label: "Criar Categoria",
                        onClick: handleNewCategory
                    }}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category: any) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onEdit={() => handleEdit(category.id)}
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
