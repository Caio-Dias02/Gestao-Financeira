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
    onSuccess: (data) => {
      // Atualiza o cache com o usuário logado
      queryClient.setQueryData(['user'], data.user);
    },
  });

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => AuthApi.register(data),
    onSuccess: (data) => {
      // Atualiza o cache com o usuário registrado
      queryClient.setQueryData(['user'], data.user);
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
