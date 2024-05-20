import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../../ai/services/openai.service';
import { CreateMessageDto } from '../dtos';

@Injectable()
export class AssistantsService {
  constructor(private readonly openaiService: OpenaiService) {}

  async createThread() {
    const thread = await this.openaiService.openAi.beta.threads.create();
    return thread;
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    const { threadId, question } = createMessageDto;
    const message =
      await this.openaiService.openAi.beta.threads.messages.create(threadId, {
        role: 'user',
        content: question,
      });
    return message;
  }
}
