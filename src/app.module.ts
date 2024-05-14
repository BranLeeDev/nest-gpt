import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [CommonModule, AiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
