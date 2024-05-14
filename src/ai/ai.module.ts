import { Module } from '@nestjs/common';
import { OpenaiService } from './services/openai.service';

@Module({
  providers: [OpenaiService],
})
export class AiModule {}
