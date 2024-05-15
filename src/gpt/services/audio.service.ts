import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { TextToAudioDto } from '../dtos';
import { OpenaiService } from '../../ai/services/openai.service';

@Injectable()
export class AudioService {
  private readonly logger = new Logger(AudioService.name);

  constructor(private readonly openaiService: OpenaiService) {}

  async textToAudio(textToAudio: TextToAudioDto) {
    const { prompt, voice } = textToAudio;
    this.logger.log(`Generating audio for text: ${prompt}`);
    const folderPath = resolve(
      __dirname,
      '..',
      '..',
      '..',
      'generated',
      'audios',
    );
    const speechFile = join(folderPath, `${randomUUID()}.mp3`);
    await mkdir(folderPath, { recursive: true });
    try {
      const mp3 = await this.openaiService.openAi.audio.speech.create({
        model: 'tts-1',
        voice,
        input: prompt,
        response_format: 'mp3',
      });
      const buffer = Buffer.from(await mp3.arrayBuffer());
      await writeFile(speechFile, buffer);
      this.logger.log(`Audio saved to file: ${speechFile}`);
      return buffer;
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
