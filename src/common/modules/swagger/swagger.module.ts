import { Module } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  DocumentBuilder,
  SwaggerModule as NestSwaggerModule,
} from '@nestjs/swagger';
import type { RawServerDefault } from 'fastify';

@Module({})
export class SwaggerModule {
  static setupSwagger(app: NestFastifyApplication<RawServerDefault>) {
    const config = new DocumentBuilder()
      .setTitle('Nest GPT')
      .setDescription('Nest GPT: Fast, secure API for OpenAI GPT')
      .setVersion('1.0')
      .build();
    const document = NestSwaggerModule.createDocument(app, config);
    NestSwaggerModule.setup('docs', app, document, { useGlobalPrefix: true });
  }
}
