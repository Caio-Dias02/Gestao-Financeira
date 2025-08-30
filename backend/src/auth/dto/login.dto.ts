import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsString({ message: 'Email deve ser um texto' })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser um texto' })
  password: string;
}