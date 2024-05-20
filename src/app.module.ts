import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AiModule } from './ai/ai.module';
import { GptModule } from './gpt/gpt.module';
import { AssistantsModule } from './assistants/assistants.module';

@Module({
  imports: [CommonModule, AiModule, GptModule, AssistantsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
