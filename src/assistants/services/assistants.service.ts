import { HttpException, Injectable, Logger } from '@nestjs/common';
import { OpenaiService } from '../../ai/services/openai.service';

@Injectable()
export class AssistantsService {
  private readonly logger = new Logger(AssistantsService.name);

  constructor(private readonly openaiService: OpenaiService) {}

  async createThread() {
    try {
      this.logger.log('Starting createThread method');
      const thread = await this.openaiService.openAi.beta.threads.create();
      this.logger.log('Successfully created a thread');
      return thread;
    } catch (error) {
      this.logger.error({
        message: error.message,
        error: error.type,
        statusCode: error.status,
      });
      throw new HttpException(error.message, error.status);
    }
  }

  async getMessagesList(threadId: string) {
    try {
      this.logger.log(
        `Starting getMessagesList method for threadId: ${threadId}`,
      );
      const messagesList =
        await this.openaiService.openAi.beta.threads.messages.list(threadId);
      this.logger.debug('Raw messages list retrieved', messagesList);
      const messages = messagesList.data.map((message) => ({
        role: message.role,
        content: message.content.map((content) => (content as any).text.value),
      }));
      this.logger.debug('Formatted messages list', messages);
      this.logger.log(
        `Successfully retrieved messages for threadId: ${threadId}`,
      );
      return messages.reverse();
    } catch (error) {
      this.logger.error({
        message: error.message,
        error: error.type,
        statusCode: error.status,
      });
      throw new HttpException(error.message, error.status);
    }
  }

  async checkRunCompleteStatus(threadId: string, runId: string) {
    try {
      this.logger.log(
        `Starting checkRunCompleteStatus method for threadId: ${threadId} and runId: ${runId}`,
      );
      while (true) {
        const runStatus = await this.retrieveRunStatus(threadId, runId);
        if (runStatus.status === 'completed') {
          this.logger.log(
            `Run completed for threadId: ${threadId}, runId: ${runId}`,
          );
          return runStatus.status;
        }
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    } catch (error) {
      this.logger.error({
        message: error.message,
        error: error.type,
        statusCode: error.status,
      });
      throw new HttpException(error.message, error.status);
    }
  }

  private async retrieveRunStatus(threadId: string, runId: string) {
    try {
      const runStatus =
        await this.openaiService.openAi.beta.threads.runs.retrieve(
          threadId,
          runId,
        );
      return runStatus;
    } catch (error) {
      this.logger.error({
        message: error.message,
        error: error.type,
        statusCode: error.status,
      });
      throw new HttpException(error.message, error.status);
    }
  }

  async createRun(threadId: string, assistantId: string) {
    try {
      this.logger.log(
        `Starting createRun method for threadId: ${threadId} and assistantId: ${assistantId}`,
      );
      const run = await this.openaiService.openAi.beta.threads.runs.create(
        threadId,
        {
          assistant_id: assistantId,
        },
      );
      this.logger.log('Run created');
      return run;
    } catch (error) {
      this.logger.error({
        message: error.message,
        error: error.type,
        statusCode: error.status,
      });
      throw new HttpException(error.message, error.status);
    }
  }

  async createMessage(threadId: string, question: string) {
    try {
      this.logger.log(`Creating message for thread ${threadId}: ${question}`);
      const message =
        await this.openaiService.openAi.beta.threads.messages.create(threadId, {
          role: 'user',
          content: question,
        });
      this.logger.log(`Message created successfully for thread ${threadId}`);
      return message;
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
