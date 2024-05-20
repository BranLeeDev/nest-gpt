import { Module } from '@nestjs/common';
import { SamAssistantController } from './controllers/sam-assistant.controller';

@Module({
  controllers: [SamAssistantController],
  providers: [],
})
export class AssistantsModule {}
