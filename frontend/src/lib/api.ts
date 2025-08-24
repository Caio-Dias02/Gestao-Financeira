import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000",
});

// Interceptor para adicionar token automaticamente em cada requisição
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado ou inválido - apenas limpar token
            // O redirecionamento será feito pelo ProtectedRoute
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);
