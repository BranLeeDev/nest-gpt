import { Module } from '@nestjs/common';
import { SamAssistantController } from './controllers/sam-assistant.controller';
import { AssistantsService } from './services/assistants.service';
import { AssistantsController } from './controllers/assistants.controller';
import { SamAssistantService } from './services/sam-assistant.service';

@Module({
  controllers: [SamAssistantController, AssistantsController],
  providers: [AssistantsService, SamAssistantService],
})
export class AssistantsModule {}
