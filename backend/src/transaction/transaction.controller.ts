import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UsePipes, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '@nestjs/passport';
import { ParseUuidIdPipe } from '../commom/pipes/parse-uuid-id.pipe';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @Req() req: any) {
    return this.transactionService.create(createTransactionDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.transactionService.findAll(req.user.id);
  }

  @Get('category/:categoryId')
  @UsePipes(ParseUuidIdPipe)
  findByCategory(@Param('categoryId') categoryId: string, @Req() req: any) {
    return this.transactionService.findByCategory(categoryId, req.user.id);
  }

  @Get('account/:accountId')
  @UsePipes(ParseUuidIdPipe)
  findByAccount(@Param('accountId') accountId: string, @Req() req: any) {
    return this.transactionService.findByAccount(accountId, req.user.id);
  }

  @Get('date-range')
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Req() req: any,
  ) {
    return this.transactionService.findByDateRange(startDate, endDate, req.user.id);
  }

  @Get(':id')
  @UsePipes(ParseUuidIdPipe)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.transactionService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @UsePipes(ParseUuidIdPipe)
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Req() req: any) {
    return this.transactionService.update(id, updateTransactionDto, req.user.id);
  }

  @Delete(':id')
  @UsePipes(ParseUuidIdPipe)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.transactionService.remove(id, req.user.id);
  }
}
