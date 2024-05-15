import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { LoggerModule as NestLoggerModule } from 'nestjs-pino';
import type { FastifyRequest } from 'fastify';
import { CORRELATION_ID_HEADER } from './constants/correlation-id.constant';
import { CorrelationIdMiddleware } from './middlewares/correlation-id.middleware';
import config from '@configs/config.config';

@Module({
  imports: [
    NestLoggerModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { isProd } = configService;
        return {
          pinoHttp: {
            transport: isProd
              ? undefined
              : {
                  target: 'pino-pretty',
                },
            autoLogging: false,
            serializers: {
              req: () => undefined,
              res: () => undefined,
            },
            customProps: (req: FastifyRequest['raw']) => {
              return {
                correlationId: req.headers[CORRELATION_ID_HEADER],
              };
            },
          },
        };
      },
    }),
  ],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
