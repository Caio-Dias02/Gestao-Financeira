import { useState } from "react";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import { Input } from "@/features/shared/components/ui/input";
import { Button } from "@/features/shared/components/ui/button";
import { Label } from "@/features/shared/components/ui/label";
import { Alert, AlertDescription } from "@/features/shared/components/ui/alert";
import { Wallet, Loader2 } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.token.access_token;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-money-pattern p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-gold opacity-10 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-success opacity-5 rounded-full blur-xl animate-bounce" />
      
      <div className="w-full max-w-lg space-y-8 relative z-10">
        {/* Logo/Brand */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-financial relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer opacity-50" />
            <Wallet className="w-10 h-10 text-white relative z-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Gestão Financeira</h1>
            <p className="text-gray-600 text-lg">Acesse sua conta para continuar</p>
          </div>
        </div>

        <Card className="shadow-financial border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-3 text-center pb-6">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-white text-sm">🔐</span>
              </div>
              Entrar
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 text-base border-2 border-gray-200 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-base font-medium text-gray-700">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 text-base border-2 border-gray-200 focus:border-primary transition-colors"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-primary hover:opacity-90 shadow-green text-white font-semibold text-base transition-all duration-200 hover:scale-[1.02]" 
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-5 w-5" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <div className="w-3 h-3 rounded-full bg-gradient-primary opacity-60" />
            <span className="text-sm font-medium">Sistema de Gestão Financeira Pessoal</span>
            <div className="w-3 h-3 rounded-full bg-gradient-gold opacity-60" />
          </div>
          <div className="text-xs text-gray-500">
            Versão 1.0.0 • Seguro & Confiável
          </div>
        </div>
      </div>
    </div>
  );
};
