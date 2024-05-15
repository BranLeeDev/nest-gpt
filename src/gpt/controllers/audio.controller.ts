import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { TextToAudioDto } from '../dtos';
import { AudioService } from '../services/audio.service';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('text-to-audio')
  @HttpCode(HttpStatus.OK)
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: FastifyReply,
  ) {
    const buffer = await this.audioService.textToAudio(textToAudioDto);
    res.type('audio/mp3').send(buffer);
  }
}
