import { api } from "@/lib/api";

export const getCategories = async () => {
    const response = await api.get("/categories");
    return response.data;
};

export const createCategory = async (data: { name: string; type: "INCOME" | "EXPENSE"; color: string; icon: string }) => {
    const response = await api.post("/categories", data);
    return response.data;
};

export const updateCategory = async (id: string, data: any) => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};
