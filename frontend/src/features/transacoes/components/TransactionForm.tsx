import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/features/shared/components/ui/dialog';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/features/shared/components/ui/select';  
import { Loader2 } from 'lucide-react';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useAccounts } from '@/features/account/hooks/useAccounts';
import { useCreateTransaction, useUpdateTransaction } from '../hooks/useTransactions';
import type { Transaction, CreateTransactionData } from '../services/transacoesApi';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction; // Para edição
}

type FormData = {
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description?: string;
  date: string;
  categoryId?: string;
  accountId?: string;
};

export default function TransactionForm({ isOpen, onClose, transaction }: TransactionFormProps) {
  const { categories } = useCategories();
  const { accounts } = useAccounts();
  
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  
  const isEditing = !!transaction;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<FormData>({
    defaultValues: isEditing ? {
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description || '',
      date: transaction.date.split('T')[0], // Convert to YYYY-MM-DD
      categoryId: transaction.categoryId || '',
      accountId: transaction.accountId || '',
    } : {
      title: '',
      amount: 0,
      type: 'EXPENSE',
      description: '',
      date: new Date().toISOString().split('T')[0],
      categoryId: '',
      accountId: '',
    }
  });

  const watchedType = watch('type');
  
  // Filtrar categorias por tipo
  const filteredCategories = categories?.filter(
    (category: any) => category.type === watchedType
  ) || [];

  const handleFormSubmit = async (data: FormData) => {
    try {
      const transactionData: CreateTransactionData = {
        title: data.title,
        amount: data.amount,
        type: data.type,
        description: data.description || undefined,
        date: new Date(data.date).toISOString(),
        categoryId: data.categoryId || undefined,
        accountId: data.accountId || undefined,
      };

      if (isEditing) {
        await updateTransaction.mutateAsync({ 
          id: transaction.id, 
          data: transactionData 
        });
      } else {
        await createTransaction.mutateAsync(transactionData);
      }
      
      handleClose();
    } catch (error) {
      // Error handled by hooks
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const isLoading = createTransaction.isPending || updateTransaction.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Transação' : 'Nova Transação'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Título *</label>
            <Input
              id="title"
              placeholder="Ex: Salário, Supermercado..."
              {...register('title', { 
                required: 'Título é obrigatório',
                minLength: { value: 2, message: 'Título deve ter pelo menos 2 caracteres' }
              })}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Valor e Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">Valor *</label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                {...register('amount', { 
                  required: 'Valor é obrigatório',
                  min: { value: 0.01, message: 'Valor deve ser maior que zero' }
                })}
              />
              {errors.amount && (
                <p className="text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo *</label>
              <Select
                value={watchedType}
                onValueChange={(value: 'INCOME' | 'EXPENSE') => setValue('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">Receita</SelectItem>
                  <SelectItem value="EXPENSE">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Data */}
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">Data *</label>
            <Input
              id="date"
              type="date"
              {...register('date', { required: 'Data é obrigatória' })}
            />
            {errors.date && (
              <p className="text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* Categoria e Conta */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select
                value={watch('categoryId')}
                onValueChange={(value) => setValue('categoryId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Conta</label>
              <Select
                value={watch('accountId')}
                onValueChange={(value) => setValue('accountId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar conta" />
                </SelectTrigger>
                <SelectContent>
                  {accounts?.map((account: any) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Descrição</label>
            <textarea
              id="description"
              placeholder="Informações adicionais (opcional)"
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('description')}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Atualizar' : 'Criar'} Transação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}