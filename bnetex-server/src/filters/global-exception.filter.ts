import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error: {
      statusCode?: number;
      status?: string;
      message?: string;
      type?: string;
      errors?: Record<string, string>;
    } = {};

    if (exception instanceof HttpException) {
      error.statusCode = exception.getStatus();
      error.message = exception.message;
      error.status = (exception.getResponse() as { status: string }).status;
    } else {
      this.logger.error(exception, exception.stack);
      error.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      error.message = 'InternalServerError';
      error.status = 'ERROR';
    }

    return response.status(error.statusCode).json(error);
  }
}
