import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  /**
   * 全局管道验证
   */
  app.useGlobalPipes(new ValidationPipe());

  /**
   * 全局异常拦截器
   */
  app.useGlobalFilters(new HttpExceptionFilter());

  /**
   * 限速（保护您的应用程序免受暴力攻击）
   */
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  await app.listen(3000);
}
bootstrap();
