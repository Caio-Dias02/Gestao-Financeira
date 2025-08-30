import { Card, CardContent, CardHeader } from '@/features/shared/components/ui/card';
import { Badge } from '@/features/shared/components/ui/badge';
import { Button } from '@/features/shared/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/features/shared/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, DollarSign } from 'lucide-react';
import type { Transaction } from '../services/transacoesApi';
import { useDeleteTransaction } from '../hooks/useTransactions';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
}

export default function TransactionCard({ transaction, onEdit }: TransactionCardProps) {
  const deleteTransaction = useDeleteTransaction();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction.mutate(transaction.id);
    }
  };

  const isIncome = transaction.type === 'INCOME';

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{transaction.title}</h3>
              <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(transaction)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
                disabled={deleteTransaction.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex justify-between items-center mb-3">
          <span className={`text-xl font-bold ${
            isIncome ? 'text-green-600' : 'text-red-600'
          }`}>
            {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
          </span>
          <Badge variant={isIncome ? 'default' : 'secondary'}>
            {isIncome ? 'Receita' : 'Despesa'}
          </Badge>
        </div>

        {transaction.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {transaction.description}
          </p>
        )}

        <div className="flex gap-2 text-xs">
          {transaction.category && (
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ 
                borderColor: transaction.category.color,
                color: transaction.category.color 
              }}
            >
              {transaction.category.name}
            </Badge>
          )}
          
          {transaction.account && (
            <Badge variant="outline" className="text-xs">
              {transaction.account.name}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
