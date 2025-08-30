import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { CustomLoggerService } from '../logger/custom-logger.service';
import { AuthenticatedRequest } from '../../auth/types/auth.types';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    
    const { method, url, ip } = request;
    const userAgent = request.headers['user-agent'];
    const startTime = Date.now();

    // Extrair userId do JWT se existir (safely cast to AuthenticatedRequest)
    const authenticatedRequest = request as AuthenticatedRequest;
    const userId = authenticatedRequest.user?.id;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        // Log da requisição com informações contextuais
        this.logger.logHttpRequest(
          method,
          url,
          statusCode,
          duration,
          {
            ip,
            userAgent,
            userId,
            contentLength: response.get('content-length'),
          }
        );
      })
    );
  }
}