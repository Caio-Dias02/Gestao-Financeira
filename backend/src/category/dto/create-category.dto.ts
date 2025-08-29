import { IsEnum, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class CreateCategoryDto {
  @IsString({ message: 'Nome deve ser um texto' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(1, 50, { message: 'Nome deve ter entre 1 e 50 caracteres' })
  name!: string;

  @IsEnum(CategoryType, { message: 'Tipo deve ser INCOME ou EXPENSE' })
  type!: CategoryType;

  @IsString({ message: 'Cor deve ser um texto' })
  @Matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/, { 
    message: 'Cor deve ser um código hexadecimal válido (ex: #FF0000 ou #F00)' 
  })
  color!: string;

  @IsString({ message: 'Ícone deve ser um texto' })
  @IsNotEmpty({ message: 'Ícone é obrigatório' })
  @Length(1, 50, { message: 'Ícone deve ter entre 1 e 50 caracteres' })
  icon!: string;
}


