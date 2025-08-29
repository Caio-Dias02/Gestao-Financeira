import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

  async validateUser(email: string, password: string) {
    const userResult = await this.userService.findByEmail(email);
    
    if (!userResult.user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    const isPasswordValid = await bcrypt.compare(password, userResult.user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    return userResult.user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}