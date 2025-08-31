import { useState, useEffect } from "react";
import { useAccounts } from "../hooks/useAccounts";
import { AccountCard } from "../components/AccountCard";
import { AccountForm } from "../components/AccountForm";
import { PageHeader } from "@/features/shared/components/ui/page-header";
import { LoadingState } from "@/features/shared/components/ui/loading-state";
import { EmptyState } from "@/features/shared/components/ui/empty-state";
import { Alert, AlertDescription } from "@/features/shared/components/ui/alert";
import { Button } from "@/features/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shared/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { 
  Plus, 
  CreditCard, 
  TrendingUp, 
  DollarSign,
  Wallet,
  PiggyBank,
  Building2,
  Banknote,
  Coins,
  Calculator
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";

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
    const [dialogOpen, setDialogOpen] = useState(false);

    // ✅ Configura o callback para limpar o estado de edição
    useEffect(() => {
        setClearEditingCallback(() => () => setEditing(null));
    }, [setClearEditingCallback]);

    const handleSubmit = (data: any) => {
        if (editing) {
            updateAccount(editing, data);
        } else {
            createAccount(data);
        }
        setDialogOpen(false);
        setEditing(null);
    };

    const handleEdit = (accountId: string) => {
        setEditing(accountId);
        setDialogOpen(true);
    };

    const handleNewAccount = () => {
        setEditing(null);
        setDialogOpen(true);
    };

    // Calcular estatísticas das contas
    const totalBalance = Array.isArray(accounts) ? accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0) : 0;
    const positiveAccounts = Array.isArray(accounts) ? accounts.filter(acc => (acc.balance || 0) > 0).length : 0;
    const accountTypes = Array.isArray(accounts) ? accounts.reduce((acc, account) => {
        acc[account.type] = (acc[account.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>) : {};

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Contas" description="Gerencie suas contas e carteiras" />
                <LoadingState type="grid" count={4} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <PageHeader title="Contas" description="Gerencie suas contas e carteiras" />
                <Alert variant="destructive">
                    <AlertDescription>
                        Erro ao carregar contas: {error.message}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // Verificação de segurança para garantir que accounts seja um array
    if (!Array.isArray(accounts)) {
        console.error("Accounts não é um array:", accounts);
        return (
            <div className="space-y-6">
                <PageHeader title="Contas" description="Gerencie suas contas e carteiras" />
                <Alert variant="destructive">
                    <AlertDescription>
                        Erro ao carregar dados das contas. Tente novamente.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <PageHeader 
                title="Contas" 
                description="Gerencie suas contas bancárias, carteiras e investimentos"
            >
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            onClick={handleNewAccount}
                            className="bg-gradient-primary hover:opacity-90 shadow-green text-white font-medium"
                            size="lg"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Conta
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader className="pb-4">
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                                    <CreditCard className="w-4 h-4 text-white" />
                                </div>
                                {editing ? "Editar Conta" : "Nova Conta"}
                            </DialogTitle>
                            <p className="text-muted-foreground">
                                {editing 
                                    ? "Atualize as informações da sua conta." 
                                    : "Adicione uma nova conta para organizar suas finanças."
                                }
                            </p>
                        </DialogHeader>
                        <div className="pt-2">
                            <AccountForm
                                account={accounts.find(a => a.id === editing)}
                                isLoading={isCreating || isUpdating}
                                onSubmit={handleSubmit}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </PageHeader>

            {/* Estatísticas das Contas */}
            {accounts.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="money-card border-0 shadow-green">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Saldo Total</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatCurrency(totalBalance)}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="money-card border-0 shadow-green">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total de Contas</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {accounts.length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center">
                                    <Wallet className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="money-card border-0 shadow-green">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Contas Positivas</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {positiveAccounts}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="money-card border-0 shadow-green">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Média por Conta</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {formatCurrency(totalBalance / (accounts.length || 1))}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <Calculator className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {accounts.length === 0 ? (
                <EmptyState
                    icon={<CreditCard className="h-16 w-16" />}
                    title="Nenhuma conta encontrada"
                    description="Comece criando sua primeira conta bancária, carteira ou investimento para organizar suas finanças."
                    action={{
                        label: "Criar Primeira Conta",
                        onClick: handleNewAccount
                    }}
                />
            ) : (
                <div className="space-y-6">
                    {/* Tipos de Conta */}
                    {Object.keys(accountTypes).length > 1 && (
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-medium text-gray-600">Filtrar por tipo:</span>
                            {Object.entries(accountTypes).map(([type, count]) => (
                                <Badge 
                                    key={type} 
                                    variant="secondary" 
                                    className="bg-primary/10 text-primary border-primary/20"
                                >
                                    {type} ({count})
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Grid de Contas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {accounts.map(account => (
                            <AccountCard
                                key={account.id}
                                account={account}
                                onEdit={handleEdit}
                                onDelete={(id) => deleteAccount(id)}
                                isDeleting={isDeleting}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
