import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config/config.module';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [ConfigModule, LoggerModule],
})
export class CommonModule {}
