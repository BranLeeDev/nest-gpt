import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AiModule } from './ai/ai.module';
import { GptModule } from './gpt/gpt.module';

@Module({
  imports: [CommonModule, AiModule, GptModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
