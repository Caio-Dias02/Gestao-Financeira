import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../services/categoriesApi";
import { toast } from "@/features/shared/components/ui/toaster";

export const useCategories = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["categories"],
        queryFn: api.getCategories,
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

    return { 
        data: query.data,
        categories: query.data?.categories || [],
        isLoading: query.isLoading, 
        error: query.error, 
        createCategory, 
        updateCategory, 
        deleteCategory 
    };
};
