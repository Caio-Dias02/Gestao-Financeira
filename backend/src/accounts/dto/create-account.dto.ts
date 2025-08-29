import { IsString, IsEnum, IsOptional, IsNumber, Min, IsNotEmpty, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CREDIT = 'CREDIT',
  CASH = 'CASH',
  INVESTMENT = 'INVESTMENT',
}

export class CreateAccountDto {
  @IsString({ message: 'Nome deve ser um texto' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(1, 50, { message: 'Nome deve ter entre 1 e 50 caracteres' })
  name: string;

  @IsEnum(AccountType, { message: 'Tipo deve ser CHECKING, SAVINGS, CREDIT, CASH ou INVESTMENT' })
  type: AccountType;

  @IsNumber({}, { message: 'Saldo deve ser um número' })
  @Min(0, { message: 'Saldo não pode ser negativo' })
  @Transform(({ value }) => Number(value))
  balance: number;

  @IsString({ message: 'Cor deve ser um texto' })
  @IsOptional()
  @Matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/, { 
    message: 'Cor deve ser um código hexadecimal válido (ex: #FF0000 ou #F00)' 
  })
  color?: string;

  @IsString({ message: 'Ícone deve ser um texto' })
  @IsOptional()
  @Length(1, 50, { message: 'Ícone deve ter entre 1 e 50 caracteres' })
  icon?: string;
}
