import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import config from './envs/configs/config.config';
import openai from './envs/configs/openai.config';
import { validate } from './envs/validations/validate.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [config, openai],
      validate,
      cache: true,
    }),
  ],
})
export class ConfigModule {}
