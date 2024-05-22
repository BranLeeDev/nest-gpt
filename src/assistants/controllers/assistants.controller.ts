import { Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AssistantsService } from '../services/assistants.service';

@ApiTags('assistants')
@Controller('assistants')
export class AssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}

  @ApiOperation({
    summary: 'Create a new thread',
    description: `Endpoint to create a new thread with the assistant service.
      Returns the result of the operation`,
  })
  @ApiCreatedResponse({
    description: 'Thread created successfully',
  })
  @ApiBadRequestResponse({
    description: 'An error ocurred',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many request. PLease try again later',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('create-thread')
  async createThread() {
    const res = await this.assistantsService.createThread();
    return res;
  }
}
