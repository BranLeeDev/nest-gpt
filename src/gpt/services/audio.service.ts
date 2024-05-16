import { Buffer } from 'node:buffer';
import { readFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { TextToAudioDto } from '../dtos';
import { OpenaiService } from '../../ai/services/openai.service';
import { checkIfFileExists, saveFileToGenerated } from '@utils/files.util';

@Injectable()
export class AudioService {
  private readonly logger = new Logger(AudioService.name);

  constructor(private readonly openaiService: OpenaiService) {}

  async textToAudio(textToAudio: TextToAudioDto) {
    const { prompt, voice } = textToAudio;
    this.logger.log(`Generating audio for text: ${prompt}`);
    try {
      const mp3 = await this.openaiService.openAi.audio.speech.create({
        model: 'tts-1',
        voice,
        input: prompt,
        response_format: 'mp3',
      });
      const buffer = Buffer.from(await mp3.arrayBuffer());
      const { filePath } = await saveFileToGenerated(buffer, 'audios', 'mp3');
      this.logger.log(`Audio saved to file: ${filePath}`);
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
    const { filePath } = checkIfFileExists('audios', fileId, 'mp3');
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
