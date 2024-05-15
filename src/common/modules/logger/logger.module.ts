import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { LoggerModule as NestLoggerModule } from 'nestjs-pino';
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
