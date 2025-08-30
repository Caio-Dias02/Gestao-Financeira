import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
    
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo global para todas as rotas da API
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades não definidas no DTO  
    forbidNonWhitelisted: false, // Permite propriedades extras (mais flexível)
    transform: true, // Converte os dados recebidos para o tipo definido no DTO
  }));

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Servidor rodando em: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
