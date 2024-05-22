import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssistantsService } from '../services/assistants.service';

@ApiTags('assistants')
@Controller('assistants')
export class AssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}

  @Post('create-thread')
  async createThread() {
    const res = await this.assistantsService.createThread();
    return res;
  }
}
