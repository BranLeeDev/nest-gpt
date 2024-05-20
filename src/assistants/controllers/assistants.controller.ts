import { Controller, Post } from '@nestjs/common';
import { AssistantsService } from '../services/assistants.service';

@Controller('assistants')
export class AssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}

  @Post('create-thread')
  async createThread() {
    const res = await this.assistantsService.createThread();
    return res;
  }
}
