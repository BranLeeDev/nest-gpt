import { Body, Controller, Post } from '@nestjs/common';
import { AssistantsService } from '../services/assistants.service';
import { CreateMessageDto } from '../dtos';

@Controller('assistants')
export class AssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}

  @Post('create-thread')
  async createThread() {
    const res = await this.assistantsService.createThread();
    return res;
  }

  @Post('user-question')
  async userQuestion(@Body() createMessageDto: CreateMessageDto) {
    const res = await this.assistantsService.createMessage(createMessageDto);
    return res;
  }
}
