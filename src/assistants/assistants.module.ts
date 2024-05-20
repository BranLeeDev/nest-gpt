import { Module } from '@nestjs/common';
import { SamAssistantController } from './controllers/sam-assistant.controller';
import { AssistantsService } from './services/assistants.service';
import { AssistantsController } from './controllers/assistants.controller';

@Module({
  controllers: [SamAssistantController, AssistantsController],
  providers: [AssistantsService],
})
export class AssistantsModule {}
