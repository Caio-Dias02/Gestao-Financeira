import React, { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { StatCard } from '../components/StatCard';
import { RecentTransactions } from '../components/RecentTransactions';
import { DashboardPeriod } from '../types/dashboard.types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

const DashboardPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<DashboardPeriod>(DashboardPeriod.MONTH);
  
  const {
    useDashboardSummary,
    useOverview,
    useAccountBalances,
    useRecentTransactions,
  } = useDashboard();

  // Buscar dados do dashboard
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useDashboardSummary();
  const { data: overview, isLoading: overviewLoading } = useOverview({ period: selectedPeriod });
  const { data: accounts, isLoading: accountsLoading } = useAccountBalances();
  const { data: recentTransactions, isLoading: transactionsLoading } = useRecentTransactions(5);

  // Função para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Função para calcular variação percentual
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / Math.abs(previous)) * 100);
  };

  // Loading state
  if (summaryLoading || overviewLoading || accountsLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (summaryError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-danger-600 text-lg mb-2">Erro ao carregar dashboard</p>
            <p className="text-gray-500">Tente novamente mais tarde</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">Dashboard Financeiro</CardTitle>
              <p className="text-gray-600">
                Visão geral das suas finanças
              </p>
            </div>
            
            {/* Filtro de período */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Período:</label>
              <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as DashboardPeriod)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DashboardPeriod.WEEK}>Esta Semana</SelectItem>
                  <SelectItem value={DashboardPeriod.MONTH}>Este Mês</SelectItem>
                  <SelectItem value={DashboardPeriod.QUARTER}>Este Trimestre</SelectItem>
                  <SelectItem value={DashboardPeriod.YEAR}>Este Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Patrimônio Total"
          value={formatCurrency(summary?.accounts?.netWorth || 0)}
          subtitle="Saldo de todas as contas"
          color="info"
          icon="💰"
        />
        
        <StatCard
          title="Receitas do Período"
          value={formatCurrency(overview?.summary?.totalIncome || 0)}
          subtitle={`${overview?.summary?.incomeCount || 0} transações`}
          color="success"
          icon="📈"
        />
        
        <StatCard
          title="Despesas do Período"
          value={formatCurrency(overview?.summary?.totalExpense || 0)}
          subtitle={`${overview?.summary?.expenseCount || 0} transações`}
          color="danger"
          icon="📉"
        />
        
        <StatCard
          title="Saldo do Período"
          value={formatCurrency(overview?.summary?.balance || 0)}
          subtitle="Receitas - Despesas"
          color={overview?.summary?.balance >= 0 ? 'success' : 'danger'}
          icon="⚖️"
        />
      </div>

      {/* Cards de estatísticas secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Contas Ativas"
          value={summary?.accounts?.accountCount || 0}
          subtitle="Total de contas bancárias"
          color="info"
          icon="🏦"
        />
        
        <StatCard
          title="Transações do Período"
          value={overview?.summary?.totalTransactions || 0}
          subtitle="Total de movimentações"
          color="warning"
          icon="📊"
        />
        
        <StatCard
          title="Variação Mensal"
          value={formatCurrency(summary?.accounts?.monthlyChange || 0)}
          subtitle="Mudança no patrimônio"
          color={summary?.accounts?.monthlyChange >= 0 ? 'success' : 'danger'}
          icon="📅"
        />
      </div>

      {/* Transações recentes e resumo das contas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transações recentes */}
        <RecentTransactions
          transactions={recentTransactions || []}
          isLoading={transactionsLoading}
        />

        {/* Resumo das contas */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo das Contas</CardTitle>
          </CardHeader>
          <CardContent>
            {accountsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : accounts?.accounts && accounts.accounts.length > 0 ? (
              <div className="space-y-3">
                {accounts.accounts.slice(0, 5).map((account: any) => (
                  <div key={account.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: account.color }}
                      >
                        {account.icon || '🏦'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{account.name}</p>
                        <p className="text-sm text-gray-500">{account.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(account.balance)}
                      </p>
                      <p className={`text-sm ${
                        account.monthChange >= 0 ? 'text-success-600' : 'text-danger-600'
                      }`}>
                        {account.monthChange >= 0 ? '+' : ''}
                        {formatCurrency(account.monthChange)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma conta encontrada</p>
                <p className="text-sm">Adicione suas contas bancárias!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informações adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Período analisado:</p>
              <p className="font-medium">
                {overview?.period?.start && new Date(overview.period.start).toLocaleDateString('pt-BR')} 
                {' até '} 
                {overview?.period?.end && new Date(overview.period.end).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Última atualização:</p>
              <p className="font-medium">
                {new Date().toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
