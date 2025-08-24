import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '../services/authApi';
import { LoginCredentials, RegisterData, User } from '../types/auth.types';

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Query para buscar usuário atual
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['user'],
    queryFn: () => AuthApi.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
    // Adiciona configurações para falhas de auth
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => AuthApi.login(credentials),
    onSuccess: async (data) => {
      console.log('🔍 [DEBUG] useAuth - Login bem-sucedido, atualizando cache...');
      
      // Após login bem-sucedido, busca o usuário atual
      try {
        const user = await AuthApi.getCurrentUser();
        queryClient.setQueryData(['user'], user);
        console.log('🔍 [DEBUG] useAuth - Usuário atual buscado e cache atualizado');
      } catch (error) {
        console.error('🔍 [DEBUG] useAuth - Erro ao buscar usuário atual:', error);
      }
    },
  });

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => AuthApi.register(data),
    onSuccess: async (data) => {
      // Após registro bem-sucedido, busca o usuário atual
      try {
        const user = await AuthApi.getCurrentUser();
        queryClient.setQueryData(['user'], user);
      } catch (error) {
        console.error('🔍 [DEBUG] useAuth - Erro ao buscar usuário atual após registro:', error);
      }
    },
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: () => AuthApi.logout(),
    onSuccess: () => {
      // Remove o usuário do cache
      queryClient.setQueryData(['user'], null);
      queryClient.clear(); // Limpa todo o cache
    },
  });

  const login = (credentials: LoginCredentials) => {
    return loginMutation.mutateAsync(credentials);
  };

  const register = (data: RegisterData) => {
    return registerMutation.mutateAsync(data);
  };

  const logout = () => {
    return logoutMutation.mutateAsync();
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };
};
