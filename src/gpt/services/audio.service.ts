import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { createReadStream, existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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

  async textToAudioGetter(fileId: string) {
    const filePath = join(
      __dirname,
      '..',
      '..',
      '..',
      'generated',
      'audios',
      `${fileId}.mp3`,
    );
    const wasFound = existsSync(filePath);
    if (!wasFound) {
      throw new NotFoundException(`File ${fileId}.mp3 not found`);
    }
    const data = await readFile(filePath);
    const buffer = Buffer.from(data);
    return buffer;
  }

  async audioToText(speechFilePath: string, prompt: string | undefined) {
    const response =
      await this.openaiService.openAi.audio.transcriptions.create({
        model: 'whisper-1',
        file: createReadStream(speechFilePath),
        prompt,
        language: 'es',
        response_format: 'verbose_json',
      });
    return response;
  }
}
