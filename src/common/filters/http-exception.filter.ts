import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'object') {
      return response
        .status(status)
        .type('application/json')
        .send(exceptionResponse);
    }

    return response.status(status).type('application/json').send({
      message: exception.message,
      error: exception.name,
      statusCode: status,
    });
  }
}
