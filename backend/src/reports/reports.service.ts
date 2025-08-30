import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(createReportDto: CreateReportDto & { userId: string }) {
    try {
      const report = await this.prisma.report.create({
        data: {
          name: createReportDto.name,
          description: createReportDto.description,
          type: createReportDto.type,
          filters: createReportDto.filters,
          userId: createReportDto.userId,
        },
      });

      return {
        message: 'Relatório criado com sucesso',
        data: report,
      };
    } catch (error) {
      throw new BadRequestException('Erro ao criar relatório');
    }
  }

  async findAllByUser(userId: string) {
    const reports = await this.prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'Relatórios encontrados',
      data: reports,
    };
  }

  async findOne(userId: string, id: string) {
    const report = await this.prisma.report.findFirst({
      where: { id, userId },
    });

    if (!report) {
      throw new NotFoundException('Relatório não encontrado');
    }

    return {
      message: 'Relatório encontrado',
      data: report,
    };
  }

  async update(userId: string, id: string, updateReportDto: UpdateReportDto) {
    await this.findOne(userId, id);

    try {
      const report = await this.prisma.report.update({
        where: { id },
        data: {
          name: updateReportDto.name,
          description: updateReportDto.description,
          type: updateReportDto.type,
          filters: updateReportDto.filters,
          updatedAt: new Date(),
        },
      });

      return {
        message: 'Relatório atualizado com sucesso',
        data: report,
      };
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar relatório');
    }
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    try {
      await this.prisma.report.delete({
        where: { id },
      });

      return {
        message: 'Relatório excluído com sucesso',
      };
    } catch (error) {
      throw new BadRequestException('Erro ao excluir relatório');
    }
  }

  async generateReportData(userId: string, reportId: string) {
    const report = await this.findOne(userId, reportId);
    const reportData = report.data;

    let data: any = {};

    switch (reportData.type) {
      case 'INCOME_EXPENSE':
        data = await this.generateIncomeExpenseReport(userId, reportData.filters);
        break;
      case 'CATEGORY_ANALYSIS':
        data = await this.generateCategoryAnalysisReport(userId, reportData.filters);
        break;
      case 'MONTHLY_SUMMARY':
        data = await this.generateMonthlySummaryReport(userId, reportData.filters);
        break;
      case 'ACCOUNT_BALANCE':
        data = await this.generateAccountBalanceReport(userId, reportData.filters);
        break;
      default:
        throw new BadRequestException('Tipo de relatório não suportado');
    }

    await this.prisma.report.update({
      where: { id: reportId },
      data: { data },
    });

    return {
      message: 'Relatório gerado com sucesso',
      data,
    };
  }

  private async generateIncomeExpenseReport(userId: string, filters?: any) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        ...(filters?.startDate && { date: { gte: new Date(filters.startDate) } }),
        ...(filters?.endDate && { date: { lte: new Date(filters.endDate) } }),
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
        ...(filters?.accountId && { accountId: filters.accountId }),
      },
      include: {
        category: true,
        account: true,
      },
    });

    const income = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
      transactions: transactions.length,
    };
  }

  private async generateCategoryAnalysisReport(userId: string, filters?: any) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        ...(filters?.startDate && { date: { gte: new Date(filters.startDate) } }),
        ...(filters?.endDate && { date: { lte: new Date(filters.endDate) } }),
      },
      include: {
        category: true,
      },
    });

    const categoryData = transactions.reduce((acc: any, transaction) => {
      const categoryName = transaction.category?.name || 'Sem categoria';
      if (!acc[categoryName]) {
        acc[categoryName] = {
          income: 0,
          expense: 0,
          count: 0,
        };
      }
      
      if (transaction.type === 'INCOME') {
        acc[categoryName].income += Number(transaction.amount);
      } else {
        acc[categoryName].expense += Number(transaction.amount);
      }
      acc[categoryName].count++;
      
      return acc;
    }, {});

    return categoryData;
  }

  private async generateMonthlySummaryReport(userId: string, filters?: any) {
    const currentYear = new Date().getFullYear();
    const year = filters?.year || currentYear;

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
    });

    const monthlyData = Array.from({ length: 12 }, (_, month) => {
      const monthTransactions = transactions.filter(
        t => new Date(t.date).getMonth() === month
      );

      const income = monthTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expense = monthTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        month: month + 1,
        income,
        expense,
        balance: income - expense,
      };
    });

    return monthlyData;
  }

  private async generateAccountBalanceReport(userId: string, filters?: any) {
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      include: {
        transactions: {
          where: {
            ...(filters?.startDate && { date: { gte: new Date(filters.startDate) } }),
            ...(filters?.endDate && { date: { lte: new Date(filters.endDate) } }),
          },
        },
      },
    });

    return accounts.map(account => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: Number(account.balance),
      transactions: account.transactions.length,
    }));
  }
}