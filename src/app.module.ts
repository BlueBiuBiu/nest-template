import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';

import { connectionParams } from '../ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { UploadModule } from './upload/upload.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigEnum } from './enums/config.enum';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DB_TYPE: Joi.string().valid('mysql', 'postgres'),
        DB_HOST: Joi.string().ip(),
        DB_PORT: Joi.number().default(3306),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
      }),
    }),
    TypeOrmModule.forRoot(connectionParams),
    // Redis集成
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const host = configService.get(ConfigEnum.REDIS_HOST);
        const port = configService.get(ConfigEnum.REDIS_PORT);
        const password = configService.get(ConfigEnum.REDIS_PASSWORD);
        const url = password
          ? `redis://${password}@${host}:${port}`
          : `redis://${host}:${port}`;
        return {
          config: {
            url,
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    RoleModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
