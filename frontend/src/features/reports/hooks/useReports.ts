import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reportsApi, type CreateReportData, type UpdateReportData } from '../services/reportsApi';
import { toast } from 'sonner';

export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: reportsApi.getAll,
  });
};

export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: () => reportsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReportData) => reportsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Relatório criado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar relatório');
    },
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReportData }) => 
      reportsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Relatório atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar relatório');
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reportsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Relatório excluído com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir relatório');
    },
  });
};

export const useGenerateReportData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reportsApi.generateData(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Dados do relatório gerados com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao gerar dados do relatório');
    },
  });
};