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

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    
    const { method, url, ip } = request;
    const userAgent = request.headers['user-agent'];
    const startTime = Date.now();

    // Extrair userId do JWT se existir
    const user = request.user as any;
    const userId = user?.sub || user?.id;

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