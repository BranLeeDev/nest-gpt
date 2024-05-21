import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AssistantsService } from './assistants.service';
import { CreateMessageDto } from '../dtos';
import openai from '@configs/openai.config';

@Injectable()
export class SamAssistantService {
  private readonly logger = new Logger(SamAssistantService.name);

  constructor(
    private readonly assistantsService: AssistantsService,
    @Inject(openai.KEY)
    private readonly configService: ConfigType<typeof openai>,
  ) {}

  async userQuestion(createMessageDto: CreateMessageDto) {
    const { samAssistantId } = this.configService.assistants;
    const { threadId, question } = createMessageDto;
    try {
      this.logger.log(`User question received: ${question}`);
      await this.assistantsService.createMessage(threadId, question);
      const run = await this.assistantsService.createRun(
        threadId,
        samAssistantId!,
      );
      await this.assistantsService.checkRunCompleteStatus(threadId, run.id);
      const messages = await this.assistantsService.getMessagesList(threadId);
      this.logger.log(`Processed user question for thread ${threadId}`);
      return messages;
    } catch (error) {
      this.logger.error({
        message: error.message,
        error: error.type,
        statusCode: error.status,
      });
      throw new HttpException(error.message, error.status);
    }
  }
}
