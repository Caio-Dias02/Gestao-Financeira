import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  create(createTransactionDto: CreateTransactionDto, userId: string) {
    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        userId,
        date: new Date(createTransactionDto.date),
      },
      include: {
        category: true,
        account: true,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true,
        account: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  findOne(id: string, userId: string) {
    return this.prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        category: true,
        account: true,
      },
    });
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto, userId: string) {
    const data: any = { ...updateTransactionDto };
    
    if (updateTransactionDto.date) {
      data.date = new Date(updateTransactionDto.date);
    }

    return this.prisma.transaction.updateMany({
      where: { id, userId },
      data,
    });
  }

  remove(id: string, userId: string) {
    return this.prisma.transaction.deleteMany({
      where: { id, userId },
    });
  }

  // Métodos de filtro
  findByCategory(categoryId: string, userId: string) {
    return this.prisma.transaction.findMany({
      where: { categoryId, userId },
      include: {
        category: true,
        account: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  findByAccount(accountId: string, userId: string) {
    return this.prisma.transaction.findMany({
      where: { accountId, userId },
      include: {
        category: true,
        account: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  findByDateRange(startDate: string, endDate: string, userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        category: true,
        account: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }
}
