import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IncomingHttpHeaders } from 'http';
import { randomUUID } from 'crypto';

interface RequestWithHeaders {
  requestId?: string;
  headers: IncomingHttpHeaders;
}

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithHeaders>();
    request.requestId = (request.headers['x-request-id'] as string | undefined) ?? randomUUID();
    return next.handle();
  }
}
