import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMessageDto } from '../dtos';
import { SamAssistantService } from '../services/sam-assistant.service';

@ApiTags('sam-assistant')
@Controller('sam-assistant')
export class SamAssistantController {
  constructor(private readonly samAssistant: SamAssistantService) {}

  @ApiCreatedResponse({
    description: 'User question processed successfully',
  })
  @ApiBadRequestResponse({
    description: 'An error ocurred',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many request. PLease try again later',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('user-question')
  async userQuestion(@Body() createMessageDto: CreateMessageDto) {
    const res = await this.samAssistant.userQuestion(createMessageDto);
    return res;
  }
}
