import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';
import {
  ThrottlerModule as NestThrottlerModule,
  ThrottlerGuard,
} from '@nestjs/throttler';
import config from '@configs/config.config';

@Module({
  imports: [
    NestThrottlerModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { throttleTtl, throttleLimit } = configService;
        return [
          {
            ttl: throttleTtl * 3600000,
            limit: throttleLimit,
          },
        ];
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ThrottlerModule {}
