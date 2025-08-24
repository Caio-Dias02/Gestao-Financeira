import { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth.types';

const API_BASE_URL = 'http://localhost:3001'; // URL do backend

export class AuthApi {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Para cookies
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🔍 [DEBUG] AuthApi.login - Iniciando login com:', {
      email: credentials.email,
      passwordLength: credentials.password.length
    });
    
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    console.log('🔍 [DEBUG] AuthApi.login - Resposta recebida:', response);
    
    // Salva o token JWT se a resposta contiver um
    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
      console.log('🔍 [DEBUG] AuthApi.login - Token salvo no localStorage');
    } else {
      console.warn('🔍 [DEBUG] AuthApi.login - Nenhum token recebido');
    }
    
    return response;
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async logout(): Promise<void> {
    await this.request<void>('/auth/logout', {
      method: 'POST',
    });
    
    // Remove o token JWT
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  }

  static async getCurrentUser(): Promise<User> {
    // Verifica se há token antes de fazer a requisição
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return this.request<User>('/user/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
