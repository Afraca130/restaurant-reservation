import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
}

export const successResponse = <T>(data: T): ApiResponse<T> => ({
  status: 'success',
  data,
});

export const errorResponse = (message: string): ApiResponse<null> => ({
  status: 'fail',
  message,
});

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(map((data) => successResponse(data)));
  }
}
