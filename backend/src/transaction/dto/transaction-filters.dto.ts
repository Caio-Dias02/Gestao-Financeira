import { IsOptional, IsEnum, IsUUID, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TransactionType } from './create-transaction.dto';

export class TransactionFiltersDto {
  // Paginação
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Página deve ser um número' })
  @Min(1, { message: 'Página deve ser maior que 0' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limite deve ser um número' })
  @Min(1, { message: 'Limite deve ser maior que 0' })
  @Max(100, { message: 'Limite máximo é 100' })
  limit?: number = 20;

  // Filtros
  @IsOptional()
  @IsEnum(TransactionType, { message: 'Tipo deve ser INCOME ou EXPENSE' })
  type?: TransactionType;

  @IsOptional()
  @IsUUID(4, { message: 'ID da categoria deve ser um UUID válido' })
  categoryId?: string;

  @IsOptional()
  @IsUUID(4, { message: 'ID da conta deve ser um UUID válido' })
  accountId?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data inicial deve estar em formato válido (ISO)' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data final deve estar em formato válido (ISO)' })
  endDate?: string;

  // Busca por texto
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  search?: string;

  // Ordenação
  @IsOptional()
  @IsEnum(['date', 'amount', 'title', 'createdAt'], { 
    message: 'Campo de ordenação deve ser: date, amount, title ou createdAt' 
  })
  sortBy?: 'date' | 'amount' | 'title' | 'createdAt' = 'date';

  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'Ordem deve ser asc ou desc' })
  sortOrder?: 'asc' | 'desc' = 'desc';
}