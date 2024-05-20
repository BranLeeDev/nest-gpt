import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../../ai/services/openai.service';

@Injectable()
export class AssistantsService {
  constructor(private readonly openaiService: OpenaiService) {}

  async createThread() {
    const thread = await this.openaiService.openAi.beta.threads.create();
    return thread;
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
}
