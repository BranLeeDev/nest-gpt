import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { FastifyReply } from 'fastify';
import { MultipartFile, MultipartValue } from '@fastify/multipart';
import { RequestFile } from '../models';
import { TextToAudioDto } from '../dtos';
import { AudioService } from '../services/audio.service';
import { saveFileToGenerated } from '@utils/files.util';

@ApiTags('audio')
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

  @Post('audio-to-text')
  async audioToText(@Req() req: RequestFile) {
    const { file, prompt, ...otherFields } = req.body ?? {};

    this.validateOtherFields(otherFields);
    this.validateFile(file);
    this.validatePrompt(prompt);

    const buffer = await (file as MultipartFile).toBuffer();
    const { filePath } = await saveFileToGenerated(buffer, 'uploads', 'm4a');
    const res = await this.audioService.audioToText(
      filePath,
      !prompt ? undefined : prompt.value,
    );
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

  private validateFile(file: MultipartFile | undefined) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (file.type !== 'file') {
      throw new BadRequestException(
        'Invalid file format. File field must be of type file',
      );
    }
    if (file.filename.length === 0) {
      throw new BadRequestException('File should not empty');
    }

    if (!file.filename.endsWith('m4a')) {
      throw new BadRequestException(
        'Invalid file type. Only .m4a files are allowed',
      );
    }
  }

  private validatePrompt(prompt: MultipartValue<string> | undefined) {
    if (prompt) {
      if (prompt.type !== 'field') {
        throw new BadRequestException(
          'Invalid prompt type. Prompt field must be of type text',
        );
      }
      if (!prompt.value.split('').some((char) => isNaN(Number(char)))) {
        throw new BadRequestException(
          'Invalid prompt value. Prompt must be a string without numbers',
        );
      }
      if (prompt.value.length <= 3 || prompt.value.length >= 60) {
        throw new BadRequestException(
          'Invalid prompt length. Prompt must be between 3 and 60 characters long',
        );
      }
      if (prompt.mimetype !== 'text/plain') {
        throw new BadRequestException(
          'Invalid prompt type. Only plain text files are allowed',
        );
      }
    }
  }

  private validateOtherFields(otherFields: object) {
    if (Object.keys(otherFields).length > 0) {
      throw new BadRequestException(
        'Invalid request. Only "file" and "prompt" keys are allowed',
      );
    }
  }
}
