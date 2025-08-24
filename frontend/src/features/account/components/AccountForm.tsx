import { useState, useEffect } from "react";
import { type Account } from "../hooks/useAccounts";

interface AccountFormProps {
    account?: Account;
    onSubmit: (data: Partial<Account>) => void;
    isLoading?: boolean;
}

export const AccountForm = ({ account, onSubmit, isLoading = false }: AccountFormProps) => {
    const [name, setName] = useState(account?.name || "");
    const [type, setType] = useState(account?.type || "CHECKING");
    const [balance, setBalance] = useState(account?.balance || 0);
    const [color, setColor] = useState(account?.color || "#22c55e");

    // Atualizar campos quando account mudar (para modo de edição)
    useEffect(() => {
        if (account) {
            setName(account.name || "");
            setType(account.type || "CHECKING");
            setBalance(account.balance || 0);
            setColor(account.color || "#22c55e");
        } else {
            // Reset para modo de criação
            setName("");
            setType("CHECKING");
            setBalance(0);
            setColor("#22c55e");
        }
    }, [account]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = { name, type, balance, color };
        console.log('🔍 [DEBUG] AccountForm.handleSubmit - Dados do formulário:', formData);
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome da conta" className="p-2 border rounded" required />
            <select value={type} onChange={e => setType(e.target.value)} className="p-2 border rounded">
                <option value="CHECKING">Conta Corrente</option>
                <option value="SAVINGS">Poupança</option>
                <option value="CREDIT">Cartão de Crédito</option>
                <option value="CASH">Dinheiro</option>
                <option value="INVESTMENT">Investimento</option>
            </select>
            <input 
                type="number" 
                value={balance} 
                onChange={e => {
                    const value = Number(e.target.value);
                    console.log('🔍 [DEBUG] AccountForm.balance - Valor digitado:', e.target.value, 'Convertido:', value);
                    setBalance(value);
                }} 
                placeholder="Saldo inicial" 
                className="p-2 border rounded" 
                step="0.01"
                min="0"
            />
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-16 h-10 p-0 border-0 rounded" />
            <button 
                type="submit" 
                className="bg-green-500 text-white p-2 rounded mt-2 disabled:opacity-50" 
                disabled={isLoading}
            >
                {isLoading ? "Salvando..." : (account ? "Atualizar" : "Salvar")}
            </button>
        </form>
    );
};
