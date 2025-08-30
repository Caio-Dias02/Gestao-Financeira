import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CustomLoggerService } from '../commom/logger/custom-logger.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionFiltersDto } from './dto/transaction-filters.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLoggerService
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    try {
      const startTime = Date.now();
      
      const transaction = await this.prisma.transaction.create({
        data: {
          ...createTransactionDto,
          userId,
          date: new Date(createTransactionDto.date),
        },
        include: {
          category: {
            select: { id: true, name: true, type: true, color: true, icon: true }
          },
          account: {
            select: { id: true, name: true, type: true, balance: true }
          },
        },
      });

      const duration = Date.now() - startTime;
      this.logger.logDatabaseOperation('CREATE', 'transactions', duration, {
        userId,
        transactionId: transaction.id,
        type: transaction.type,
        amount: transaction.amount.toString()
      });

      return {
        message: 'Transação criada com sucesso',
        transaction,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao criar transação: ${error.message}`,
        error.stack,
        'TransactionService',
        { userId, data: createTransactionDto }
      );
      throw new BadRequestException('Erro ao criar transação');
    }
  }

  async findAllWithFilters(userId: string, filters: TransactionFiltersDto) {
    try {
      const startTime = Date.now();
      
      // Construir where clause dinamicamente
      const where: any = { userId };
      
      if (filters.type) {
        where.type = filters.type;
      }
      
      if (filters.categoryId) {
        where.categoryId = filters.categoryId;
      }
      
      if (filters.accountId) {
        where.accountId = filters.accountId;
      }
      
      if (filters.startDate || filters.endDate) {
        where.date = {};
        if (filters.startDate) {
          where.date.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          where.date.lte = new Date(filters.endDate);
        }
      }
      
      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      // Paginação - garantir valores padrão
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const skip = (page - 1) * limit;
      const take = limit;

      // Buscar transações e total
      const [transactions, total] = await Promise.all([
        this.prisma.transaction.findMany({
          where,
          include: {
            category: {
              select: { id: true, name: true, type: true, color: true, icon: true }
            },
            account: {
              select: { id: true, name: true, type: true }
            },
          },
          orderBy: {
            [filters.sortBy ?? 'date']: filters.sortOrder ?? 'desc',
          },
          skip,
          take,
        }),
        this.prisma.transaction.count({ where }),
      ]);

      const duration = Date.now() - startTime;
      this.logger.logDatabaseOperation('SELECT', 'transactions', duration, {
        userId,
        filters: JSON.stringify(filters),
        resultCount: transactions.length,
        totalCount: total
      });

      return {
        message: 'Transações encontradas com sucesso',
        data: transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: (page * limit) < total,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      this.logger.error(
        `Erro ao buscar transações: ${error.message}`,
        error.stack,
        'TransactionService',
        { userId, filters }
      );
      throw new BadRequestException('Erro ao buscar transações');
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const transaction = await this.prisma.transaction.findFirst({
        where: { id, userId },
        include: {
          category: {
            select: { id: true, name: true, type: true, color: true, icon: true }
          },
          account: {
            select: { id: true, name: true, type: true }
          },
        },
      });

      if (!transaction) {
        throw new NotFoundException('Transação não encontrada');
      }

      this.logger.debug('Transação encontrada', 'TransactionService', {
        userId,
        transactionId: id
      });

      return {
        message: 'Transação encontrada com sucesso',
        transaction,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(
        `Erro ao buscar transação: ${error.message}`,
        error.stack,
        'TransactionService',
        { userId, transactionId: id }
      );
      throw new BadRequestException('Erro ao buscar transação');
    }
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto, userId: string) {
    try {
      const startTime = Date.now();
      
      // Verificar se a transação existe
      const existingTransaction = await this.prisma.transaction.findFirst({
        where: { id, userId },
      });

      if (!existingTransaction) {
        throw new NotFoundException('Transação não encontrada');
      }

      const data: any = { ...updateTransactionDto };
      
      if (updateTransactionDto.date) {
        data.date = new Date(updateTransactionDto.date);
      }

      const updatedTransaction = await this.prisma.transaction.update({
        where: { id },
        data,
        include: {
          category: {
            select: { id: true, name: true, type: true, color: true, icon: true }
          },
          account: {
            select: { id: true, name: true, type: true }
          },
        },
      });

      const duration = Date.now() - startTime;
      this.logger.logDatabaseOperation('UPDATE', 'transactions', duration, {
        userId,
        transactionId: id,
        updatedFields: Object.keys(updateTransactionDto)
      });

      return {
        message: 'Transação atualizada com sucesso',
        transaction: updatedTransaction,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        `Erro ao atualizar transação: ${error.message}`,
        error.stack,
        'TransactionService',
        { userId, transactionId: id, data: updateTransactionDto }
      );
      throw new BadRequestException('Erro ao atualizar transação');
    }
  }

  async remove(id: string, userId: string) {
    try {
      const startTime = Date.now();
      
      // Verificar se a transação existe
      const existingTransaction = await this.prisma.transaction.findFirst({
        where: { id, userId },
        select: { id: true, title: true, amount: true }
      });

      if (!existingTransaction) {
        throw new NotFoundException('Transação não encontrada');
      }

      await this.prisma.transaction.delete({
        where: { id },
      });

      const duration = Date.now() - startTime;
      this.logger.logDatabaseOperation('DELETE', 'transactions', duration, {
        userId,
        transactionId: id,
        deletedTransactionTitle: existingTransaction.title,
        deletedAmount: existingTransaction.amount.toString()
      });

      return {
        message: 'Transação excluída com sucesso',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        `Erro ao excluir transação: ${error.message}`,
        error.stack,
        'TransactionService',
        { userId, transactionId: id }
      );
      throw new BadRequestException('Erro ao excluir transação');
    }
  }

  // Manter método findAll simples para compatibilidade
  async findAll(userId: string) {
    const defaultFilters = new TransactionFiltersDto();
    return this.findAllWithFilters(userId, defaultFilters);
  }

  // Métodos de filtro (usando o novo sistema)
  async findByCategory(categoryId: string, userId: string) {
    const filters = new TransactionFiltersDto();
    filters.categoryId = categoryId;
    return this.findAllWithFilters(userId, filters);
  }

  async findByAccount(accountId: string, userId: string) {
    const filters = new TransactionFiltersDto();
    filters.accountId = accountId;
    return this.findAllWithFilters(userId, filters);
  }

  async findByDateRange(startDate: string, endDate: string, userId: string) {
    const filters = new TransactionFiltersDto();
    filters.startDate = startDate;
    filters.endDate = endDate;
    return this.findAllWithFilters(userId, filters);
  }
}
