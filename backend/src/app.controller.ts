import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Endpoint para testar tratamento de erros (remover depois)
  @Post('test-error')
  testError(@Body() body: { type?: string }) {
    switch (body.type) {
      case 'http':
        throw new HttpException('Erro HTTP de teste', HttpStatus.BAD_REQUEST);
      case 'generic':
        throw new Error('Erro genérico de teste');
      case 'validation':
        throw new HttpException(
          {
            message: ['Campo é obrigatório', 'Email deve ser válido'],
            error: 'Bad Request',
            statusCode: 400,
          },
          HttpStatus.BAD_REQUEST
        );
      default:
        return { message: 'Teste funcionando! Use type: http, generic ou validation' };
    }
  }
}
