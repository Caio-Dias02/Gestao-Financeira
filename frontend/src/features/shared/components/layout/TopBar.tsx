import { Button } from "@/features/shared/components/ui/button";
import { useNavigate } from "react-router-dom";

export function TopBar() {
    const navigate = useNavigate();
    return (
        <header className="w-full h-14 flex items-center justify-between px-6 border-b bg-white shadow-sm">
            <h1 className="text-xl font-bold">Gestão Financeira</h1>
            <nav className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate("/")}>Dashboard</Button>
                <Button variant="ghost" onClick={() => navigate("/contas")}>Contas</Button>
                <Button variant="ghost" onClick={() => navigate("/transacoes")}>Transações</Button>
                <Button variant="ghost" onClick={() => navigate("/relatorios")}>Relatórios</Button>
                <Button variant="ghost" onClick={() => navigate("/configuracoes")}>Configurações</Button>
                <Button variant="ghost" onClick={() => navigate("/categorias")}>Categorias</Button>
            </nav>
        </header>
    );
}
