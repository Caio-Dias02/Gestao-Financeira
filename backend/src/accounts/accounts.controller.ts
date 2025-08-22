import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UsePipes } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AuthGuard } from '@nestjs/passport';
import { ParseUuidIdPipe } from '../commom/pipes/parse-uuid-id.pipe';

@Controller('accounts')
@UseGuards(AuthGuard('jwt'))
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto, @Req() req: any) {
    return this.accountsService.create(createAccountDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.accountsService.findAll(req.user.id);
  }

  @Get(':id')
  @UsePipes(ParseUuidIdPipe)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.accountsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @UsePipes(ParseUuidIdPipe)
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto, @Req() req: any) {
    return this.accountsService.update(id, updateAccountDto, req.user.id);
  }

  @Delete(':id')
  @UsePipes(ParseUuidIdPipe)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.accountsService.remove(id, req.user.id);
  }
}
