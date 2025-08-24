import { useState, useEffect } from "react";
import { useAccounts } from "../hooks/useAccounts";
import { AccountCard } from "../components/AccountCard";
import { AccountForm } from "../components/AccountForm";
import { Skeleton } from "@/features/shared/components/ui/skeleton";

export const AccountsPage = () => {
    const { 
        accounts, 
        loading, 
        error,
        createAccount, 
        updateAccount, 
        deleteAccount,
        isCreating,
        isUpdating,
        isDeleting,
        setClearEditingCallback
    } = useAccounts();
    const [editing, setEditing] = useState<string | null>(null);

    // ✅ Configura o callback para limpar o estado de edição
    useEffect(() => {
        setClearEditingCallback(() => () => setEditing(null));
    }, [setClearEditingCallback]);

    // Debug: log quando editing mudar
    console.log("Estado editing atual:", editing);
    console.log("Conta sendo editada:", editing ? accounts.find(a => a.id === editing) : null);

    if (loading) {
        return <Skeleton className="h-10 w-full" />;
    }
    
    if (error) return <div className="text-red-500 text-center">Erro ao carregar contas: {error.message}</div>;

    // Verificação de segurança para garantir que accounts seja um array
    if (!Array.isArray(accounts)) {
        console.error("Accounts não é um array:", accounts);
        return <div>Erro ao carregar contas. Tente novamente.</div>;
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-center">Gerenciamento de Contas</h1>

            <div className="max-w-md mx-auto">
                <AccountForm
                    account={accounts.find(a => a.id === editing) || undefined}
                    isLoading={isCreating || isUpdating}
                    onSubmit={data => {
                        if (editing) {
                            updateAccount(editing, data);
                            // setEditing(null) será chamado no onSuccess da mutation
                        } else {
                            createAccount(data);
                        }
                    }}
                />
            </div>

            {accounts.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                    Nenhuma conta encontrada. Crie sua primeira conta acima.
                </div>
            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {accounts.map(account => (
                        <AccountCard
                            key={account.id}
                            account={account}
                            onEdit={(id) => {
                                console.log("Editando conta com ID:", id);
                                setEditing(id);
                            }}
                            onDelete={() => deleteAccount(account.id)}
                            isDeleting={isDeleting}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
