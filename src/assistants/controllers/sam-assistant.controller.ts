import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMessageDto } from '../dtos';
import { SamAssistantService } from '../services/sam-assistant.service';

@ApiTags('sam-assistant')
@Controller('sam-assistant')
export class SamAssistantController {
  constructor(private readonly samAssistant: SamAssistantService) {}

  @ApiOperation({
    summary: 'Create a new thread',
    description: `This endpoint processes a user question and returns a response.
    It handles creation of messages using a DTO containing necessary
    information like user input and context`,
  })
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
