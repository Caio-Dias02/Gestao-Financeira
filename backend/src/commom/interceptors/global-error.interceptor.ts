import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Request } from 'express';
import { CustomLoggerService } from '../logger/custom-logger.service';

@Injectable()
export class GlobalErrorInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const request = context.switchToHttp().getRequest<Request>();
        const { method, url, body, params, query } = request;

        // Extrair dados do contexto (sem dados sensíveis)
        const requestContext = {
          method,
          url,
          params,
          query,
          // Não incluir body para evitar vazar senhas/dados sensíveis
          userAgent: request.headers['user-agent'],
          ip: request.ip,
        };

        if (error instanceof HttpException) {
          // Erros HTTP esperados (400, 401, 404, 409, etc.)
          const status = error.getStatus();
          const message = error.message;

          // Log apenas para erros 5xx (servidor)
          if (status >= 500) {
            this.logger.error(
              `Erro interno do servidor: ${message}`,
              error.stack,
              'ErrorInterceptor',
              {
                ...requestContext,
                statusCode: status,
              }
            );
          } else {
            // Log de debug para erros de cliente (4xx)
            this.logger.debug(
              `Erro de cliente: ${message}`,
              'ErrorInterceptor',
              {
                ...requestContext,
                statusCode: status,
              }
            );
          }

          // Retornar erro HTTP normalmente
          return throwError(() => error);
        } else {
          // Erros não tratados (bugs, Prisma, etc.)
          this.logger.error(
            `Erro não tratado: ${error.message}`,
            error.stack,
            'ErrorInterceptor',
            {
              ...requestContext,
              errorType: error.name,
              errorMessage: error.message,
            }
          );

          // Converter para HttpException genérica
          const genericError = new HttpException(
            'Erro interno do servidor',
            HttpStatus.INTERNAL_SERVER_ERROR
          );

          return throwError(() => genericError);
        }
      })
    );
  }
}