import { IsString, IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CREDIT = 'CREDIT',
  CASH = 'CASH',
  INVESTMENT = 'INVESTMENT',
}

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsEnum(AccountType)
  type: AccountType;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  balance: number;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
