import { type Account } from "../hooks/useAccounts";

interface AccountCardProps {
    account: Account;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
}

export const AccountCard = ({ account, onEdit, onDelete, isDeleting = false }: AccountCardProps) => {
    return (
        <div className="p-4 border rounded shadow flex justify-between items-center">
            <div>
                <h2 className="font-bold">{account.name}</h2>
                <p className="text-sm text-gray-500">{account.type}</p>
                <p className="text-lg font-semibold">{account.balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => onEdit(account.id)} 
                    className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                    disabled={isDeleting}
                >
                    Editar
                </button>
                <button 
                    onClick={() => onDelete(account.id)} 
                    className="px-2 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                    disabled={isDeleting}
                >
                    {isDeleting ? "Excluindo..." : "Excluir"}
                </button>
            </div>
        </div>
    );
};
