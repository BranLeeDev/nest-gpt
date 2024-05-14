import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import config from './envs/configs/config.config';
import { validate } from './envs/validations/validate.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validate,
      cache: true,
    }),
  ],
})
export class ConfigModule {}
