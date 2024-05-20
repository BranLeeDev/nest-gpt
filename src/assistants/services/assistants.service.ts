import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../../ai/services/openai.service';

@Injectable()
export class AssistantsService {
  constructor(private readonly openaiService: OpenaiService) {}

  async createThread() {
    const thread = await this.openaiService.openAi.beta.threads.create();
    return thread;
  }

  async getMessagesList(threadId: string) {
    const messagesList =
      await this.openaiService.openAi.beta.threads.messages.list(threadId);
    const messages = messagesList.data.map((message) => ({
      role: message.role,
      content: message.content.map((content) => (content as any).text.value),
    }));
    return messages.reverse();
  }

  async checkRunCompleteStatus(threadId: string, runId: string) {
    while (true) {
      const runStatus = await this.retrieveRunStatus(threadId, runId);
      if (runStatus.status === 'completed') {
        return runStatus.status;
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  async retrieveRunStatus(threadId: string, runId: string) {
    const runStatus =
      await this.openaiService.openAi.beta.threads.runs.retrieve(
        threadId,
        runId,
      );
    return runStatus;
  }

  async createRun(threadId: string, assistantId: string) {
    const run = await this.openaiService.openAi.beta.threads.runs.create(
      threadId,
      {
        assistant_id: assistantId,
      },
    );
    return run;
  }

  async createMessage(threadId: string, question: string) {
    const message =
      await this.openaiService.openAi.beta.threads.messages.create(threadId, {
        role: 'user',
        content: question,
      });
    return message;
  }
}
