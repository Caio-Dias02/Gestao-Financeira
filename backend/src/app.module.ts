import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionModule } from './transaction/transaction.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [UserModule, AuthModule, CategoryModule, AccountsModule, TransactionModule, GroupsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
