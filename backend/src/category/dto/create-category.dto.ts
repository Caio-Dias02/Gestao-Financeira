import { IsEnum, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name!: string;

  @IsEnum(CategoryType)
  type!: CategoryType;

  // Hex color #RGB or #RRGGBB
  @IsString()
  @Matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
  color!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  icon!: string;
}


