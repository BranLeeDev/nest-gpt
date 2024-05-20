import { Module } from '@nestjs/common';
import { SamAssistantController } from './controllers/sam-assistant.controller';
import { AssistantsService } from './services/assistants.service';

@Module({
  controllers: [SamAssistantController],
  providers: [AssistantsService],
})
export class AssistantsModule {}
