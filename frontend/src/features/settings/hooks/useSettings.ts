import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsApi, type CreateSettingData, type UpdateSettingData } from '../services/settingsApi';
import { toast } from 'sonner';

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.getAll,
  });
};

export const useSetting = (key: string) => {
  return useQuery({
    queryKey: ['settings', key],
    queryFn: () => settingsApi.getByKey(key),
    enabled: !!key,
  });
};

export const useCreateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSettingData) => settingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Configuração criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar configuração');
    },
  });
};

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: UpdateSettingData }) => 
      settingsApi.update(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Configuração atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar configuração');
    },
  });
};

export const useUpsertSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => 
      settingsApi.upsert(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Configuração salva com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao salvar configuração');
    },
  });
};

export const useDeleteSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) => settingsApi.delete(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Configuração excluída com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir configuração');
    },
  });
};

export const useDefaultSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.getDefaults,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Configurações padrão aplicadas!');
    },
    onError: () => {
      toast.error('Erro ao aplicar configurações padrão');
    },
  });
};