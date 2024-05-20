import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AssistantsService } from './assistants.service';
import { CreateMessageDto } from '../dtos';
import openai from '@configs/openai.config';

@Injectable()
export class SamAssistantService {
  constructor(
    private readonly assistantsService: AssistantsService,
    @Inject(openai.KEY)
    private readonly configService: ConfigType<typeof openai>,
  ) {}

  async userQuestion(createMessageDto: CreateMessageDto) {
    const { samAssistantId } = this.configService.assistants;
    const { threadId, question } = createMessageDto;
    await this.assistantsService.createMessage(threadId, question);
    const run = await this.assistantsService.createRun(
      threadId,
      samAssistantId!,
    );
    await this.assistantsService.checkRunCompleteStatus(run.id, threadId);
    const messages = await this.assistantsService.getMessagesList(threadId);
    return messages;
  }
}
