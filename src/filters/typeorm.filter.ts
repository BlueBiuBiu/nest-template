import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TypeORMError, QueryFailedError } from 'typeorm';

@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    let statusCode = 500;
    if (exception instanceof QueryFailedError) {
      statusCode = exception.driverError.errno;
    }
    // 响应 请求对象
    const response = ctx.getResponse();
    response.status(500).json({
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
      // path: request.url,
      // method: request.method,
      message: exception.message,
    });
  }
}
