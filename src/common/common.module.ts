import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config/config.module';
import { LoggerModule } from './modules/logger/logger.module';
import { ThrottlerModule } from './modules/throttler/throttler.module';

@Module({
  imports: [ConfigModule, LoggerModule, ThrottlerModule],
})
export class CommonModule {}
