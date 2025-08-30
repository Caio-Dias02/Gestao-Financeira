import { IsNotEmpty, IsString, Length, IsIn } from 'class-validator';

const VALID_SETTING_KEYS = [
  'theme',
  'language',
  'currency',
  'dateFormat',
  'notifications',
  'defaultCategory',
  'defaultAccount',
] as const;

export class CreateSettingDto {
  @IsString({ message: 'Chave deve ser um texto' })
  @IsNotEmpty({ message: 'Chave é obrigatória' })
  @IsIn(VALID_SETTING_KEYS, { 
    message: `Chave deve ser uma das opções válidas: ${VALID_SETTING_KEYS.join(', ')}` 
  })
  key!: string;

  @IsString({ message: 'Valor deve ser um texto' })
  @IsNotEmpty({ message: 'Valor é obrigatório' })
  @Length(1, 255, { message: 'Valor deve ter entre 1 e 255 caracteres' })
  value!: string;
}