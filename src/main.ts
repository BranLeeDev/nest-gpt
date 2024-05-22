import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { fastifyHelmet } from '@fastify/helmet';
import { fastifyMultipart } from '@fastify/multipart';
import { AppModule } from './app.module';
import { SwaggerModule } from './common/modules/swagger/swagger.module';
import { HttpExceptionFilter } from '@filters/http-exception.filter';

async function bootstrap() {
  const MAX_BODY_LIMIT = Number(process.env.MAX_BODY_LIMIT);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: MAX_BODY_LIMIT * 1024 * 1024 }),
    { bufferLogs: true },
  );
  const configService = app.get(ConfigService);
  const PORT = Number(configService.get('PORT'));
  const MAX_FILE_SIZE = Number(configService.get('MAX_FILE_SIZE'));
  app.useLogger(app.get(Logger));
  app.enableCors({
    origin: [],
  });
  app.setGlobalPrefix('api/v1');
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'img-src': ['self', 'https:'],
      },
    },
  });
  await app.register(fastifyMultipart, {
    attachFieldsToBody: true,
    limits: {
      fileSize: MAX_FILE_SIZE * 1024 * 1024,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  SwaggerModule.setupSwagger(app);
  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
