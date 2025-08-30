import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Extrair mensagem do erro
    const exceptionResponse = exception.getResponse();
    let message = exception.message;

    // Se for erro de validação, extrair mensagens específicas
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;
      
      // Erros de validação do class-validator
      if (responseObj.message && Array.isArray(responseObj.message)) {
        message = responseObj.message.join(', ');
      } else if (responseObj.message) {
        message = responseObj.message;
      }
    }

    // Resposta padronizada
    const errorResponse = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log apenas para desenvolvimento (não em produção)
    if (process.env.NODE_ENV !== 'production' && status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${message}`,
        exception.stack
      );
    }

    response.status(status).json(errorResponse);
  }
}