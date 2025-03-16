import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const defaultMessage = [exception.message];
    const exceptionRespons: any = exception.getResponse();
    const exceptionResponMessage =
      exceptionRespons?.message ?? exception.message ?? 'Unknown error';

    const message = Array.isArray(exceptionResponMessage)
      ? exceptionResponMessage
      : [exceptionResponMessage];

    this.logger.error(`HTTP ${status} Error: ${JSON.stringify(message)}`);

    const error = exceptionRespons?.error;
    response.status(status).json({
      statusCode: status,
      message: message?.length ? message : defaultMessage,
      error: error ? error : 'Bad Request',
    });
  }
}
