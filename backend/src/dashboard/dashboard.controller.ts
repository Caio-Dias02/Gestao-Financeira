import { Controller, Get, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';
import { DashboardFiltersDto, BalanceHistoryDto, DashboardPeriod } from './dto/dashboard-filters.dto';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  getOverview(@Query() filters: DashboardFiltersDto, @Request() req) {
    return this.dashboardService.getOverview(req.user.id, filters);
  }

  @Get('categories')
  getCategoryBreakdown(@Query() filters: DashboardFiltersDto, @Request() req) {
    return this.dashboardService.getCategoryBreakdown(req.user.id, filters);
  }

  @Get('accounts')
  getAccountBalances(@Request() req) {
    return this.dashboardService.getAccountBalances(req.user.id);
  }

  @Get('balance-history')
  getBalanceHistory(@Query() filters: BalanceHistoryDto, @Request() req) {
    return this.dashboardService.getBalanceHistory(req.user.id, filters);
  }

  @Get('recent-transactions')
  getRecentTransactions(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Request() req
  ) {
    return this.dashboardService.getRecentTransactions(req.user.id, limit);
  }

  @Get('monthly-trends')
  getMonthlyTrends(
    @Query('months', new ParseIntPipe({ optional: true })) months: number = 6,
    @Request() req
  ) {
    return this.dashboardService.getMonthlyTrends(req.user.id, months);
  }

  @Get('summary')
  async getSummary(@Request() req) {
    // Endpoint que retorna um resumo completo para o dashboard principal
    const [overview, accounts, recentTransactions] = await Promise.all([
      this.dashboardService.getOverview(req.user.id, { period: DashboardPeriod.MONTH }),
      this.dashboardService.getAccountBalances(req.user.id),
      this.dashboardService.getRecentTransactions(req.user.id, 5),
    ]);

    return {
      overview,
      accounts: accounts.summary,
      recentTransactions,
      quickStats: {
        totalAccounts: accounts.summary.accountCount,
        totalTransactions: overview.summary.totalTransactions,
        netWorth: accounts.summary.totalBalance,
        monthlyChange: accounts.summary.totalMonthChange,
      },
    };
  }
}
