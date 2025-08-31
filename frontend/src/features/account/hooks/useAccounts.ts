import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/features/shared/components/ui/toaster";

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  color: string;
  icon: string;
}

// Função para buscar contas
const fetchAccounts = async (): Promise<Account[]> => {
  const res = await api.get("/dashboard/accounts");
  console.log("Resposta da API de contas:", res.data);
  
  // Garantir que sempre seja um array
  const accountsData = res.data?.accounts || res.data?.summary?.accounts || [];
  return Array.isArray(accountsData) ? accountsData : [];
};

export const useAccounts = () => {
  const queryClient = useQueryClient();
  
  // Callback para limpar estado de edição (será passado do componente)
  let clearEditingCallback: (() => void) | null = null;
  
  const setClearEditingCallback = (callback: () => void) => {
    clearEditingCallback = callback;
  };

  // ✅ Query para buscar contas
  const { 
    data: accounts = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
  });

  // ✅ Mutation para criar conta
  const createMutation = useMutation({
    mutationFn: async (account: Partial<Account>) => {
      console.log('🔍 [DEBUG] useAccounts.createAccount - Dados enviados:', account);
      const res = await api.post("/accounts", account);
      console.log('🔍 [DEBUG] useAccounts.createAccount - Resposta:', res.data);
      return res.data;
    },
    onSuccess: () => {
      // ✅ Invalida e refaz a query de contas
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      // ✅ Invalida dashboard para atualização em tempo real
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({
        title: "Conta criada com sucesso!",
        description: "A conta foi criada e salva no sistema.",
        duration: 3000
      });
    },
    onError: (error) => {
      console.error('Erro ao criar conta:', error);
      toast({
        title: "Erro ao criar conta",
        description: "Não foi possível criar a conta. Tente novamente.",
        duration: 5000
      });
    }
  });

  // ✅ Mutation para atualizar conta
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Account> }) => {
      const res = await api.patch(`/accounts/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      // ✅ Invalida e refaz a query de contas
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      // ✅ Invalida dashboard para atualização em tempo real
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({
        title: "Conta atualizada com sucesso!",
        description: "As alterações foram salvas no sistema.",
        duration: 3000
      });
      // ✅ Limpa o estado de edição após sucesso
      if (clearEditingCallback) {
        clearEditingCallback();
      }
    },
    onError: (error) => {
      console.error('Erro ao atualizar conta:', error);
      toast({
        title: "Erro ao atualizar conta",
        description: "Não foi possível atualizar a conta. Tente novamente.",
        duration: 5000
      });
    }
  });

  // ✅ Mutation para deletar conta
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/accounts/${id}`);
      return id;
    },
    onSuccess: () => {
      // ✅ Invalida e refaz a query de contas
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      // ✅ Invalida dashboard para atualização em tempo real
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({
        title: "Conta deletada com sucesso!",
        description: "A conta foi removida do sistema.",
        duration: 3000
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar conta:', error);
      toast({
        title: "Erro ao deletar conta",
        description: "Não foi possível deletar a conta. Tente novamente.",
        duration: 5000
      });
    }
  });

  return { 
    accounts, 
    loading: isLoading, 
    error,
    refetch,
    createAccount: createMutation.mutate,
    updateAccount: (id: string, data: Partial<Account>) => updateMutation.mutate({ id, data }),
    deleteAccount: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    setClearEditingCallback,
  };
};
