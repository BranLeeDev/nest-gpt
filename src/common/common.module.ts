import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config/config.module';
import { LoggerModule } from './modules/logger/logger.module';
import { ThrottlerModule } from './modules/throttler/throttler.module';
import { SwaggerModule } from './modules/swagger/swagger.module';

@Module({
  imports: [ConfigModule, LoggerModule, ThrottlerModule, SwaggerModule],
})
export class CommonModule {}
