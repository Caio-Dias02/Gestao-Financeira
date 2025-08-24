import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { RecentTransaction } from '../types/dashboard.types';

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
  isLoading?: boolean;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma transação encontrada</p>
            <p className="text-sm">Comece a registrar suas finanças!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'INCOME':
        return (
          <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
            <span className="text-success-600 text-lg">↑</span>
          </div>
        );
      case 'EXPENSE':
        return (
          <div className="w-10 h-10 bg-danger-100 rounded-full flex items-center justify-center">
            <span className="text-danger-600 text-lg">↓</span>
          </div>
        );
      case 'TRANSFER':
        return (
          <div className="w-10 h-10 bg-info-100 rounded-full flex items-center justify-center">
            <span className="text-info-600 text-lg">↔</span>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-lg">?</span>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              {getTransactionIcon(transaction.type)}
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {transaction.description}
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {transaction.category && (
                    <span className="flex items-center space-x-1">
                      <span 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: transaction.category.color }}
                      ></span>
                      <span>{transaction.category.name}</span>
                    </span>
                  )}
                  {transaction.account && (
                    <span>• {transaction.account.name}</span>
                  )}
                  <span>• {formatDate(transaction.date)}</span>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'INCOME' ? 'text-success-600' : 
                  transaction.type === 'EXPENSE' ? 'text-danger-600' : 
                  'text-gray-600'
                }`}>
                  {transaction.type === 'EXPENSE' ? '-' : ''}
                  {formatCurrency(Math.abs(transaction.amount))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
