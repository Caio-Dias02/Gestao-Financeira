import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

  async validateUser(email: string, password: string) {
    console.log('🔍 [DEBUG] AuthService.validateUser - Iniciando validação para:', email);
    
    const userResult = await this.userService.findByEmail(email);
    console.log('🔍 [DEBUG] AuthService.validateUser - Resultado findByEmail:', {
      hasUser: !!userResult.user,
      userId: userResult.user?.id,
      userEmail: userResult.user?.email,
      hasPassword: !!userResult.user?.password,
      passwordLength: userResult.user?.password?.length
    });
    
    if (!userResult.user) {
      console.log('🔍 [DEBUG] AuthService.validateUser - Usuário não encontrado');
      throw new UnauthorizedException('User not found');
    }
    
    console.log('🔍 [DEBUG] AuthService.validateUser - Comparando senhas...');
    const isPasswordValid = await bcrypt.compare(password, userResult.user.password);
    console.log('🔍 [DEBUG] AuthService.validateUser - Resultado da comparação:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('🔍 [DEBUG] AuthService.validateUser - Senha inválida');
      throw new UnauthorizedException('Invalid password');
    }
    
    console.log('🔍 [DEBUG] AuthService.validateUser - Usuário validado com sucesso');
    return userResult.user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}