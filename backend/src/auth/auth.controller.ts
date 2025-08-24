import { Controller, Post, Res } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async login(@Body() {email, password}: LoginDto, @Res({passthrough: true}) res: Response) {	
		console.log('🔍 [DEBUG] AuthController.login - Dados recebidos:', {
			email,
			passwordLength: password?.length,
			hasPassword: !!password
		});
		
		console.log('🔍 [DEBUG] AuthController.login - Chamando validateUser...');
		const user = await this.authService.validateUser(email, password);
		console.log('🔍 [DEBUG] AuthController.login - Usuário validado:', {
			id: user.id,
			email: user.email,
			name: user.name
		});

		console.log('🔍 [DEBUG] AuthController.login - Gerando token...');
		const { access_token } = await this.authService.login(user);
		console.log('🔍 [DEBUG] AuthController.login - Token gerado com sucesso');

		res.cookie('access_token', access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 3600000,
		});

		console.log('🔍 [DEBUG] AuthController.login - Cookie definido, retornando resposta');
		return {message: 'Login successful', token: { access_token }};
	}

	@Post('logout')
	async logout(@Res({passthrough: true}) res: Response) {
		res.clearCookie('access_token');
		return {message: 'Logout successful'};
	}	
}