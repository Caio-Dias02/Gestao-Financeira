import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardFiltersDto, BalanceHistoryDto, DashboardPeriod } from './dto/dashboard-filters.dto';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Dashboard Service - Responsável por todas as agregações e relatórios financeiros
 * 
 * Este serviço fornece endpoints para:
 * - Visão geral financeira (receitas, despesas, saldo)
 * - Breakdown por categorias
 * - Saldos das contas
 * - Histórico de saldos
 * - Transações recentes
 * - Tendências mensais
 */
@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calcula o intervalo de datas baseado no período solicitado
   * 
   * @param period - Período predefinido (semana, mês, trimestre, ano)
   * @param startDate - Data inicial personalizada (opcional)
   * @param endDate - Data final personalizada (opcional)
   * @returns Objeto com data de início e fim do período
   */
  private getDateRange(period: DashboardPeriod, startDate?: string, endDate?: string) {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    // Se datas customizadas foram fornecidas, usa elas
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Caso contrário, calcula baseado no período solicitado
      switch (period) {
        case DashboardPeriod.WEEK:
          // Últimos 7 dias: subtrai 7 dias em milissegundos
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case DashboardPeriod.MONTH:
          // Mês atual: 1º dia do mês
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case DashboardPeriod.QUARTER:
          // Trimestre atual: calcula qual trimestre estamos e pega o 1º dia
          const quarter = Math.floor(now.getMonth() / 3);
          start = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case DashboardPeriod.YEAR:
          // Ano atual: 1º de janeiro
          start = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          // Padrão: mês atual
          start = new Date(now.getFullYear(), now.getMonth(), 1);
      }
    }

    return { start, end };
  }

  /**
   * Obtém visão geral financeira do usuário para o período especificado
   * 
   * @param userId - ID do usuário autenticado
   * @param filters - Filtros de período, conta e categoria
   * @returns Resumo financeiro com receitas, despesas e saldo
   */
  async getOverview(userId: string, filters: DashboardFiltersDto) {
    // Calcula o intervalo de datas baseado nos filtros
    // Se não especificado, usa mês atual como padrão
    const { start, end } = this.getDateRange(filters.period || DashboardPeriod.MONTH, filters.startDate, filters.endDate);
    
    // Construir cláusula WHERE base para todas as consultas
    const whereClause: any = {
      userId,  // Sempre filtra por usuário (segurança)
      date: { gte: start, lte: end }  // Filtra por período
    };

    // Aplicar filtros opcionais se fornecidos
    if (filters.accountId) {
      whereClause.accountId = filters.accountId;  // Filtrar por conta específica
    }

    if (filters.categoryId) {
      whereClause.categoryId = filters.categoryId;  // Filtrar por categoria específica
    }

    // Executar 3 consultas em paralelo para melhor performance
    // 1. Soma e contagem de receitas
    // 2. Soma e contagem de despesas  
    // 3. Total de transações no período
    const [income, expense, totalTransactions] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { ...whereClause, type: 'INCOME' },  // Apenas receitas
        _sum: { amount: true },  // Soma dos valores
        _count: true,            // Conta quantas receitas
      }),
      this.prisma.transaction.aggregate({
        where: { ...whereClause, type: 'EXPENSE' }, // Apenas despesas
        _sum: { amount: true },  // Soma dos valores
        _count: true,            // Conta quantas despesas
      }),
      this.prisma.transaction.count({ where: whereClause }), // Total de transações
    ]);

    // Converter valores do Prisma Decimal para números JavaScript
    // Se não houver valores, usa 0 como padrão
    const totalIncome = income._sum.amount || new Decimal(0);
    const totalExpense = expense._sum.amount || new Decimal(0);
    
    // Calcula o saldo: receitas - despesas
    const balance = totalIncome.minus(totalExpense);

    // Retorna estrutura organizada com período e resumo
    return {
      period: { start, end },  // Período analisado
      summary: {
        totalIncome: totalIncome.toNumber(),    // Total de receitas
        totalExpense: totalExpense.toNumber(),  // Total de despesas
        balance: balance.toNumber(),            // Saldo (receitas - despesas)
        totalTransactions,                      // Quantidade total de transações
        incomeCount: income._count,            // Quantidade de receitas
        expenseCount: expense._count,          // Quantidade de despesas
      },
    };
  }

  /**
   * Obtém breakdown financeiro agrupado por categorias
   * 
   * @param userId - ID do usuário autenticado
   * @param filters - Filtros de período e conta
   * @returns Gastos e receitas organizados por categoria com detalhes visuais
   */
  async getCategoryBreakdown(userId: string, filters: DashboardFiltersDto) {
    // Calcula o intervalo de datas baseado nos filtros
    const { start, end } = this.getDateRange(filters.period || DashboardPeriod.MONTH, filters.startDate, filters.endDate);
    
    // Construir cláusula WHERE base
    const whereClause: any = {
      userId,  // Sempre filtra por usuário
      date: { gte: start, lte: end }  // Filtra por período
    };

    // Aplicar filtro de conta se fornecido
    if (filters.accountId) {
      whereClause.accountId = filters.accountId;
    }

    // 1. Agrupar DESPESAS por categoria
    // Retorna: categoryId, soma dos valores, contagem de transações
    const expensesByCategory = await this.prisma.transaction.groupBy({
      by: ['categoryId', 'type'],  // Agrupa por categoria e tipo
      where: { ...whereClause, type: 'EXPENSE' },  // Apenas despesas
      _sum: { amount: true },      // Soma dos valores
      _count: true,                // Conta quantas transações
    });

    // 2. Agrupar RECEITAS por categoria
    // Retorna: categoryId, soma dos valores, contagem de transações
    const incomeByCategory = await this.prisma.transaction.groupBy({
      by: ['categoryId', 'type'],  // Agrupa por categoria e tipo
      where: { ...whereClause, type: 'INCOME' },   // Apenas receitas
      _sum: { amount: true },      // Soma dos valores
      _count: true,                // Conta quantas transações
    });

    // 3. Extrair IDs únicos de categorias (tanto de despesas quanto receitas)
    // Combina arrays e remove valores null com type guard
    const categoryIds = [
      ...expensesByCategory.map(e => e.categoryId),
      ...incomeByCategory.map(i => i.categoryId)
    ].filter((id): id is string => id !== null);

    // 4. Buscar detalhes visuais das categorias (nome, cor, ícone)
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, color: true, icon: true, type: true }
    });

    // 5. Criar mapa para acesso rápido aos detalhes da categoria
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    // 6. Processar dados de DESPESAS: adicionar detalhes da categoria
    const expenses = expensesByCategory.map(item => ({
      categoryId: item.categoryId,
      category: item.categoryId ? categoryMap.get(item.categoryId) : null,  // Detalhes visuais
      amount: item._sum.amount?.toNumber() || 0,  // Valor total da categoria
      count: item._count,                         // Quantidade de transações
    }));

    // 7. Processar dados de RECEITAS: adicionar detalhes da categoria
    const income = incomeByCategory.map(item => ({
      categoryId: item.categoryId,
      category: item.categoryId ? categoryMap.get(item.categoryId) : null,  // Detalhes visuais
      amount: item._sum.amount?.toNumber() || 0,  // Valor total da categoria
      count: item._count,                         // Quantidade de transações
    }));

    // Retorna estrutura organizada com período e dados por categoria
    return {
      period: { start, end },  // Período analisado
      expenses,                // Despesas agrupadas por categoria
      income,                  // Receitas agrupadas por categoria
    };
  }

  /**
   * Obtém saldos e informações de todas as contas do usuário
   * 
   * @param userId - ID do usuário autenticado
   * @returns Lista de contas com saldos, variação mensal e estatísticas
   */
  async getAccountBalances(userId: string) {
    // 1. Buscar todas as contas do usuário com detalhes visuais
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,        // Nome da conta (ex: "Conta Corrente")
        type: true,        // Tipo (CHECKING, SAVINGS, etc.)
        balance: true,     // Saldo atual da conta
        color: true,       // Cor para identificação visual
        icon: true,        // Ícone para identificação visual
        _count: {
          select: { transactions: true }  // Conta quantas transações a conta tem
        }
      },
    });

    // 2. Para cada conta, calcular a variação do mês atual
    // Executa todas as consultas em paralelo para melhor performance
    const accountsWithBalance = await Promise.all(
      accounts.map(async (account) => {
        // Calcula o início do mês atual (1º dia)
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        // Busca todas as transações da conta desde o início do mês
        const monthTransactions = await this.prisma.transaction.aggregate({
          where: {
            accountId: account.id,  // Filtra por conta específica
            userId,                 // Filtra por usuário (segurança)
            date: { gte: startOfMonth }  // Desde o início do mês
          },
          _sum: { amount: true }  // Soma todos os valores (receitas + despesas)
        });

        // Se não houver transações, usa 0 como padrão
        const monthChange = monthTransactions._sum.amount || new Decimal(0);
        
        // Retorna conta com dados calculados
        return {
          ...account,                                    // Todos os dados originais da conta
          balance: account.balance.toNumber(),           // Saldo atual (convertido para número)
          monthChange: monthChange.toNumber(),           // Variação do mês (convertido para número)
          transactionCount: account._count.transactions, // Quantidade de transações
        };
      })
    );

    // 3. Calcular totais consolidados
    const totalBalance = accountsWithBalance.reduce((sum, acc) => sum + acc.balance, 0);        // Patrimônio total
    const totalMonthChange = accountsWithBalance.reduce((sum, acc) => sum + acc.monthChange, 0); // Variação total do mês

    // 4. Retorna estrutura organizada
    return {
      accounts: accountsWithBalance,  // Lista de contas com dados calculados
      summary: {
        totalBalance,      // Patrimônio líquido total (soma de todas as contas)
        totalMonthChange,  // Variação total do mês (soma das variações)
        accountCount: accountsWithBalance.length,  // Quantidade de contas
      },
    };
  }

  /**
   * Obtém histórico de saldos com evolução temporal
   * 
   * @param userId - ID do usuário autenticado
   * @param filters - Filtros de período e conta específica
   * @returns Evolução diária dos saldos com mudanças e saldo acumulado
   */
  async getBalanceHistory(userId: string, filters: BalanceHistoryDto) {
    // Sempre usa período customizado para histórico
    const { start, end } = this.getDateRange(
      DashboardPeriod.CUSTOM, 
      filters.startDate, 
      filters.endDate
    );

    // Construir cláusula WHERE base
    const whereClause: any = {
      userId,  // Sempre filtra por usuário
      date: { gte: start, lte: end }  // Filtra por período personalizado
    };

    // Aplicar filtro de conta se fornecido
    if (filters.accountId) {
      whereClause.accountId = filters.accountId;
    }

    // 1. Agrupar transações por data para mostrar evolução diária
    const dailyBalances = await this.prisma.transaction.groupBy({
      by: ['date'],  // Agrupa por data
      where: whereClause,
      _sum: { amount: true },  // Soma dos valores de cada dia
    });

    // 2. Processar dados para criar série temporal
    const sortedBalances = dailyBalances
      // Ordenar por data (mais antiga primeiro)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      // Calcular saldo acumulado para cada dia
      .map((item, index, array) => {
        const amount = item._sum.amount?.toNumber() || 0;  // Mudança do dia
        
        // Saldo acumulado: soma de todas as mudanças até este dia
        const previousBalance = index > 0 ? array[index - 1]._sum.amount?.toNumber() || 0 : 0;
        
        return {
          date: item.date,                    // Data do registro
          dailyChange: amount,                // Mudança do dia (receitas - despesas)
          cumulativeBalance: previousBalance + amount,  // Saldo acumulado
        };
      });

    // Retorna período analisado e série temporal de saldos
    return {
      period: { start, end },  // Período do histórico
      balances: sortedBalances, // Evolução diária dos saldos
    };
  }

  /**
   * Obtém as transações mais recentes do usuário
   * 
   * @param userId - ID do usuário autenticado
   * @param limit - Quantidade de transações a retornar (padrão: 10)
   * @returns Lista de transações recentes com categoria e conta
   */
  async getRecentTransactions(userId: string, limit: number = 10) {
    return this.prisma.transaction.findMany({
      where: { userId },  // Filtra por usuário
      include: {
        category: true,  // Inclui detalhes da categoria (nome, cor, ícone)
        account: true,   // Inclui detalhes da conta (nome, tipo)
      },
      orderBy: { date: 'desc' },  // Mais recentes primeiro
      take: limit,                 // Limita a quantidade retornada
    });
  }

  /**
   * Obtém tendências mensais para análise de padrões financeiros
   * 
   * @param userId - ID do usuário autenticado
   * @param months - Quantidade de meses para analisar (padrão: 6)
   * @returns Array com receitas, despesas e saldo de cada mês
   */
  async getMonthlyTrends(userId: string, months: number = 6) {
    const now = new Date();
    // Array tipado para armazenar tendências mensais
    const trends: Array<{ month: string; income: number; expense: number; balance: number }> = [];

    // Loop pelos meses solicitados (do mais antigo ao mais recente)
    for (let i = months - 1; i >= 0; i--) {
      // Calcula início e fim de cada mês
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);  // 1º dia do mês
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0); // Último dia do mês

      // Executa 2 consultas em paralelo para melhor performance
      const [income, expense] = await Promise.all([
        // 1. Soma de receitas do mês
        this.prisma.transaction.aggregate({
          where: {
            userId,
            type: 'INCOME',
            date: { gte: monthStart, lte: monthEnd }
          },
          _sum: { amount: true }
        }),
        // 2. Soma de despesas do mês
        this.prisma.transaction.aggregate({
          where: {
            userId,
            type: 'EXPENSE',
            date: { gte: monthStart, lte: monthEnd }
          },
          _sum: { amount: true }
        })
      ]);

      // Adiciona dados do mês ao array de tendências
      trends.push({
        month: monthStart.toISOString().slice(0, 7), // Formato: YYYY-MM
        income: income._sum.amount?.toNumber() || 0,  // Receitas do mês
        expense: expense._sum.amount?.toNumber() || 0, // Despesas do mês
        balance: (income._sum.amount || new Decimal(0)).minus(expense._sum.amount || new Decimal(0)).toNumber(), // Saldo do mês
      });
    }

    return trends;  // Array ordenado do mais antigo ao mais recente
  }
}
