import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CustomLoggerService } from '../commom/logger/custom-logger.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, 
    private readonly userService: UserService,
    private readonly logger: CustomLoggerService
  ) {}

  async validateUser(email: string, password: string) {
    const userResult = await this.userService.findByEmail(email);
    
    if (!userResult.user) {
      // Log de tentativa de login com email inexistente
      this.logger.logAuthEvent('login_failed', undefined, { 
        reason: 'user_not_found',
        email: email.substring(0, 3) + '***' // Email parcialmente ofuscado
      });
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    const isPasswordValid = await bcrypt.compare(password, userResult.user.password);
    
    if (!isPasswordValid) {
      // Log de tentativa de login com senha incorreta
      this.logger.logAuthEvent('login_failed', userResult.user.id, { 
        reason: 'invalid_password',
        email: email.substring(0, 3) + '***'
      });
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    // Log de validação de usuário bem-sucedida
    this.logger.debug('Usuário validado com sucesso', 'AuthService', {
      userId: userResult.user.id,
      email: email.substring(0, 3) + '***'
    });
    
    return userResult.user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    
    // Log de login bem-sucedido
    this.logger.logAuthEvent('login_success', user.id, {
      email: user.email.substring(0, 3) + '***'
    });
    
    return {
      access_token: token,
    };
  }
}