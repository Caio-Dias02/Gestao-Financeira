import { 
  IsString, 
  IsEmail, 
  IsNotEmpty, 
  IsStrongPassword, 
  Length,
  Matches
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser um texto' })
  @Length(2, 50, { message: 'Nome deve ter entre 2 e 50 caracteres' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser um texto' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { 
      message: 'Senha deve ter pelo menos 8 caracteres, incluindo: 1 maiúscula, 1 minúscula, 1 número e 1 símbolo' 
    }
  )
  password: string;
}
    