import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { transacoesApi } from '../services/transacoesApi';
import type { 
  TransactionFilters,  
  UpdateTransactionData 
} from '../services/transacoesApi';

// Query keys
export const transactionKeys = {
  all: ['transactions'] as const,
  filtered: (filters: TransactionFilters) => ['transactions', 'filtered', filters] as const,
  detail: (id: string) => ['transactions', 'detail', id] as const,
};

// Hook para listar transações com filtros
export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: transactionKeys.filtered(filters || {}),
    queryFn: () => transacoesApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para buscar transação por ID
export function useTransaction(id: string) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transacoesApi.getById(id),
    enabled: !!id,
  });
}

// Hook para criar transação
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transacoesApi.create,
    onSuccess: (_) => {
      // Invalidar todas as queries de transações
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      
      // Invalidar dados do dashboard para atualização em tempo real
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      toast.success('Transação criada com sucesso!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao criar transação';
      toast.error(message);
    },
  });
}

// Hook para atualizar transação
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionData }) => 
      transacoesApi.update(id, data),
    onSuccess: (  _, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.id) });
      
      // Invalidar dados do dashboard para atualização em tempo real
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      toast.success('Transação atualizada com sucesso!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao atualizar transação';
      toast.error(message);
    },
  });
}

// Hook para excluir transação
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transacoesApi.delete,
    onSuccess: () => {
      // Invalidar todas as queries de transações
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      
      // Invalidar dados do dashboard para atualização em tempo real
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      toast.success('Transação excluída com sucesso!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao excluir transação';
      toast.error(message);
    },
  });
}