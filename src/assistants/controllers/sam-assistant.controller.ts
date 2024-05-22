import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateMessageDto } from '../dtos';
import { SamAssistantService } from '../services/sam-assistant.service';

@ApiTags('sam-assistant')
@Controller('sam-assistant')
export class SamAssistantController {
  constructor(private readonly samAssistant: SamAssistantService) {}

  @Post('user-question')
  async userQuestion(@Body() createMessageDto: CreateMessageDto) {
    const res = await this.samAssistant.userQuestion(createMessageDto);
    return res;
  }
}
