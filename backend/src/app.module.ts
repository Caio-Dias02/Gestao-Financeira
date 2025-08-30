import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionModule } from './transaction/transaction.module';
import { GroupsModule } from './groups/groups.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { GlobalErrorInterceptor } from './commom/interceptors/global-error.interceptor';
import { LoggingInterceptor } from './commom/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './commom/filters/http-exception.filter';
import { CustomLoggerService } from './commom/logger/custom-logger.service';

@Module({
  imports: [UserModule, AuthModule, CategoryModule, AccountsModule, TransactionModule, GroupsModule, DashboardModule],
  controllers: [AppController],
  providers: [
    AppService, 
    PrismaService,
    CustomLoggerService,
    // Interceptador de logging para todas as requisições (executa primeiro)
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // Interceptador global para capturar todos os erros (executa depois)
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalErrorInterceptor,
    },
    // Filter global para padronizar respostas de erro (executa por último)
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
