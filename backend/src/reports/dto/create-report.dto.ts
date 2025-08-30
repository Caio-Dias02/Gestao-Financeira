import { IsEnum, IsNotEmpty, IsString, Length, IsOptional, IsObject } from 'class-validator';

export enum ReportType {
  INCOME_EXPENSE = 'INCOME_EXPENSE',
  CATEGORY_ANALYSIS = 'CATEGORY_ANALYSIS',
  MONTHLY_SUMMARY = 'MONTHLY_SUMMARY',
  ACCOUNT_BALANCE = 'ACCOUNT_BALANCE',
}

export class CreateReportDto {
  @IsString({ message: 'Nome deve ser um texto' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(1, 100, { message: 'Nome deve ter entre 1 e 100 caracteres' })
  name!: string;

  @IsString({ message: 'Descrição deve ser um texto' })
  @IsOptional()
  @Length(1, 255, { message: 'Descrição deve ter no máximo 255 caracteres' })
  description?: string;

  @IsEnum(ReportType, { message: 'Tipo deve ser INCOME_EXPENSE, CATEGORY_ANALYSIS, MONTHLY_SUMMARY ou ACCOUNT_BALANCE' })
  type!: ReportType;

  @IsOptional()
  @IsObject({ message: 'Filtros devem ser um objeto JSON válido' })
  filters?: any;
}