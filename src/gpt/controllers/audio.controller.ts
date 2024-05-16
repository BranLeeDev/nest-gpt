import { writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import type { FastifyReply } from 'fastify';
import { RequestFile } from '../models';
import { TextToAudioDto } from '../dtos';
import { AudioService } from '../services/audio.service';
import openai from '@configs/openai.config';

@Controller('audio')
export class AudioController {
  constructor(
    @Inject(openai.KEY)
    private readonly configService: ConfigType<typeof openai>,
    private readonly audioService: AudioService,
  ) {}

  @Post('text-to-audio')
  @HttpCode(HttpStatus.OK)
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: FastifyReply,
  ) {
    const buffer = await this.audioService.textToAudio(textToAudioDto);
    res.type('audio/mp3').send(buffer);
  }

  @Post('audio-to-text')
  async audioToText(@Req() req: RequestFile) {
    const { maxFileSize } = this.configService;
    if (!req.file) {
      throw new BadRequestException('File is required');
    }
    const data = await req.file({
      limits: {
        fileSize: maxFileSize * 1024 * 1024,
      },
    });
    if (data.mimetype !== 'audio/mp4') {
      throw new BadRequestException(
        'Invalid file type. Only .m4a files are allowed.',
      );
    }
    const buffer = await data.toBuffer();
    const folderPath = resolve(
      __dirname,
      '..',
      '..',
      '..',
      'generated',
      'uploads',
    );
    const speechFilePath = join(folderPath, `${randomUUID()}.m4a`);
    await writeFile(speechFilePath, buffer);
    const res = await this.audioService.audioToText(speechFilePath);
    return res;
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Param('fileId', ParseUUIDPipe) fileId: string,
    @Res() res: FastifyReply,
  ) {
    const buffer = await this.audioService.textToAudioGetter(fileId);
    res.type('audio/mp3').send(buffer);
  }
}
