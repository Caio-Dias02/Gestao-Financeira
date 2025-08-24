import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../services/categoriesApi";
import { toast } from "@/features/shared/components/ui/toaster";

export const useCategories = () => {
    const queryClient = useQueryClient();

    const { data: categories = [], isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: api.getCategories,
        select: (data) => data?.categories || []
    });

    const createCategory = useMutation({
        mutationFn: api.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({ title: "Categoria criada!", description: "Sucesso ao criar categoria" });
        },
        onError: () => {
            toast({ title: "Erro", description: "Não foi possível criar a categoria" });
        }
    });

    const updateCategory = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => api.updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({ title: "Categoria atualizada!" });
        }
    });

    const deleteCategory = useMutation({
        mutationFn: api.deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({ title: "Categoria deletada!" });
        }
    });

    return { categories, isLoading, error, createCategory, updateCategory, deleteCategory };
};
