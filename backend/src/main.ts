import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
    
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades não definidas no DTO  
    forbidNonWhitelisted: true, // Retorna um erro se alguma propriedade não for definida no DTO
    transform: false, // Converte os dados recebidos para o tipo definido no DTO
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
