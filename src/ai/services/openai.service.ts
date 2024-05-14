import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OpenAI } from 'openai';
import openai from '@configs/openai.config';

@Injectable()
export class OpenaiService {
  constructor(
    @Inject(openai.KEY)
    private readonly configService: ConfigType<typeof openai>,
  ) {}

  readonly openAi = new OpenAI({
    apiKey: this.configService.secretKey,
  });
}
