import { useState } from 'react';
import { Card, CardContent } from '@/features/shared/components/ui/card';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/features/shared/components/ui/select';
import { Badge } from '@/features/shared/components/ui/badge';

import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  RotateCcw
} from 'lucide-react';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useAccounts } from '@/features/account/hooks/useAccounts';
import type { TransactionFilters } from '../services/transacoesApi';

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  onReset: () => void;
}

export default function TransactionFiltersComponent({ 
  filters, 
  onFiltersChange, 
  onReset 
}: TransactionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { data: categoriesData } = useCategories();
  const { data: accountsData } = useAccounts();

  const updateFilter = (key: keyof TransactionFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1, // Reset to first page when filtering
    });
  };

  const removeFilter = (key: keyof TransactionFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange({ ...newFilters, page: 1 });
  };

  const getActiveFiltersCount = () => {
    const { page, limit, sortBy, sortOrder, ...activeFilters } = filters;
    return Object.values(activeFilters).filter(value => 
      value !== undefined && value !== ''
    ).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        {/* Search Bar + Quick Filters */}
        <div className="flex flex-wrap gap-3 items-center mb-4">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar transações..."
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
            {filters.search && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={() => removeFilter('search')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Quick Type Filters */}
          <div className="flex gap-2">
            <Button
              variant={filters.type === 'INCOME' ? 'default' : 'outline'}
              size="sm"
              onClick={() => 
                filters.type === 'INCOME' 
                  ? removeFilter('type')
                  : updateFilter('type', 'INCOME')
              }
              className="gap-1"
            >
              <TrendingUp className="h-3 w-3" />
              Receitas
            </Button>
            <Button
              variant={filters.type === 'EXPENSE' ? 'default' : 'outline'}
              size="sm"
              onClick={() => 
                filters.type === 'EXPENSE'
                  ? removeFilter('type')
                  : updateFilter('type', 'EXPENSE')
              }
              className="gap-1"
            >
              <TrendingDown className="h-3 w-3" />
              Despesas
            </Button>
          </div>

          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-1"
          >
            <Filter className="h-3 w-3" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {/* Reset Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="gap-1 text-muted-foreground"
            >
              <RotateCcw className="h-3 w-3" />
              Limpar
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.type && (
              <Badge variant="outline" className="gap-1">
                {filters.type === 'INCOME' ? 'Receitas' : 'Despesas'}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFilter('type')}
                />
              </Badge>
            )}
            {filters.categoryId && (
              <Badge variant="outline" className="gap-1">
                {categoriesData?.categories?.find(c => c.id === filters.categoryId)?.name || 'Categoria'}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFilter('categoryId')}
                />
              </Badge>
            )}
            {filters.accountId && (
              <Badge variant="outline" className="gap-1">
                {accountsData?.accounts?.find(a => a.id === filters.accountId)?.name || 'Conta'}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFilter('accountId')}
                />
              </Badge>
            )}
            {filters.startDate && (
              <Badge variant="outline" className="gap-1">
                De: {new Date(filters.startDate).toLocaleDateString('pt-BR')}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFilter('startDate')}
                />
              </Badge>
            )}
            {filters.endDate && (
              <Badge variant="outline" className="gap-1">
                Até: {new Date(filters.endDate).toLocaleDateString('pt-BR')}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFilter('endDate')}
                />
              </Badge>
            )}
          </div>
        )}

        {/* Advanced Filters Panel */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select
                value={filters.categoryId || ''}
                onValueChange={(value) => 
                  value ? updateFilter('categoryId', value) : removeFilter('categoryId')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categoriesData?.categories?.map((category) => (
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

            {/* Account Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Conta</label>
              <Select
                value={filters.accountId || ''}
                onValueChange={(value) => 
                  value ? updateFilter('accountId', value) : removeFilter('accountId')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as contas</SelectItem>
                  {accountsData?.accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Inicial</label>
              <Input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => 
                  e.target.value 
                    ? updateFilter('startDate', e.target.value)
                    : removeFilter('startDate')
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data Final</label>
              <Input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => 
                  e.target.value 
                    ? updateFilter('endDate', e.target.value)
                    : removeFilter('endDate')
                }
              />
            </div>
          </div>
        )}

        {/* Sort Options */}
        <div className="flex flex-wrap gap-3 items-center pt-4 border-t mt-4">
          <label className="text-sm font-medium">Ordenar por:</label>
          
          <Select
            value={filters.sortBy || 'date'}
            onValueChange={(value) => updateFilter('sortBy', value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Data</SelectItem>
              <SelectItem value="amount">Valor</SelectItem>
              <SelectItem value="title">Título</SelectItem>
              <SelectItem value="createdAt">Criação</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortOrder || 'desc'}
            onValueChange={(value) => updateFilter('sortOrder', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Mais recente</SelectItem>
              <SelectItem value="asc">Mais antigo</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.limit?.toString() || '20'}
            onValueChange={(value) => updateFilter('limit', Number(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 por página</SelectItem>
              <SelectItem value="20">20 por página</SelectItem>
              <SelectItem value="50">50 por página</SelectItem>
              <SelectItem value="100">100 por página</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}