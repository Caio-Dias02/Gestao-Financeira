import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { api } from "@/lib/api";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const [isValidating, setIsValidating] = useState(true);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem("token");
            
            if (!token) {
                setIsValidating(false);
                setIsValid(false);
                return;
            }

            try {
                // Tentar fazer uma requisição para validar o token
                await api.get("/auth/validate"); // Endpoint para validar token
                setIsValid(true);
            } catch (error: any) {
                console.log("Erro na validação do token:", error);
                localStorage.removeItem("token");
                setIsValid(false);
            } finally {
                setIsValidating(false);
            }
        };

        validateToken();
    }, []);

    if (isValidating) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verificando autenticação...</p>
                </div>
            </div>
        );
    }

    if (!isValid) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};