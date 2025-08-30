import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CustomLoggerService } from '../commom/logger/custom-logger.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService, CustomLoggerService],
})
export class TransactionModule {}
