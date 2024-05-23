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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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

  @ApiOperation({
    summary: 'Converts text to audio. (Not working)',
    description:
      'Converts text to audio file (MP3 format) and returns it as a binary response',
  })
  @ApiOkResponse({
    description:
      'The text-to-audio conversion was successful. The audio file is returned as a binary response',
  })
  @ApiBadRequestResponse({
    description: 'An error ocurred',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many request. PLease try again later',
  })
  @ApiProduces('audio/mp3')
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('text-to-audio')
  @HttpCode(HttpStatus.OK)
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: FastifyReply,
  ) {
    const buffer = await this.audioService.textToAudio(textToAudioDto);
    res.type('audio/mp3').send(buffer);
  }

  @ApiOperation({
    summary: 'Converts audio file to text. (Not working)',
    description:
      'Converts uploaded audio file (M4A format) to text, optionally using a prompt, and returns the text result',
  })
  @ApiCreatedResponse({
    description: 'Audio file successfully converted to text',
  })
  @ApiBadRequestResponse({
    description: 'An error ocurred',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many request. PLease try again later',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        prompt: {
          type: 'string',
        },
      },
    },
  })
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

  @ApiOperation({
    summary: 'Retrieves audio file by ID. (Not working)',
    description:
      'Retrieves and streams the audio file (MP3 format) associated with the specified file ID',
  })
  @ApiOkResponse({
    description: 'Find audio file',
  })
  @ApiBadRequestResponse({
    description: 'An error ocurred',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many request. PLease try again later',
  })
  @ApiProduces('audio/mp3')
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
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
