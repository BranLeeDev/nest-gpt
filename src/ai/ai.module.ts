import { Global, Module } from '@nestjs/common';
import { OpenaiService } from './services/openai.service';

@Global()
@Module({
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class AiModule {}
