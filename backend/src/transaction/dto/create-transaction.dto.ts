import { IsString, IsEnum, IsOptional, IsNumber, IsDateString, IsUUID, IsNotEmpty, Length, Min } from 'class-validator';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class CreateTransactionDto {
  @IsString({ message: 'Título deve ser um texto' })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @Length(1, 100, { message: 'Título deve ter entre 1 e 100 caracteres' })
  title: string;

  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  amount: number;

  @IsEnum(TransactionType, { message: 'Tipo deve ser INCOME ou EXPENSE' })
  type: TransactionType;

  @IsString({ message: 'Descrição deve ser um texto' })
  @IsOptional()
  @Length(0, 500, { message: 'Descrição deve ter no máximo 500 caracteres' })
  description?: string;

  @IsDateString({}, { message: 'Data deve estar em formato válido (ISO)' })
  date: string;

  @IsUUID(4, { message: 'ID da categoria deve ser um UUID válido' })
  @IsOptional()
  categoryId?: string;

  @IsUUID(4, { message: 'ID da conta deve ser um UUID válido' })
  @IsOptional()
  accountId?: string;
}
