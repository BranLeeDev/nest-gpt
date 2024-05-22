import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { FastifyReply } from 'fastify';
import { MultipartFile, MultipartValue } from '@fastify/multipart';
import {
  ImageGenerationDto,
  ImageMaskingDto,
  ImageVariationDto,
} from '../dtos';
import { RequestFile } from '../models';
import { ImageService } from '../services/image.service';
import { saveFileToGenerated } from '@utils/files.util';

@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    const res = await this.imageService.imageGeneration(imageGenerationDto);
    return res;
  }

  @Post('image-variation')
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    const res = await this.imageService.imageVariation(imageVariationDto);
    return res;
  }

  @Post('image-masking')
  async imageMasking(@Body() imageMaskingDto: ImageMaskingDto) {
    const res = await this.imageService.imageMasking(imageMaskingDto);
    return res;
  }

  @Post('extract-text-from-image')
  async extractTextFromImage(@Req() req: RequestFile) {
    const { file, prompt, ...otherFields } = req.body ?? {};

    this.validateOtherFields(otherFields);
    this.validateFile(file);
    this.validatePrompt(prompt);

    const buffer = await (file as MultipartFile).toBuffer();
    const { filePath } = await saveFileToGenerated(buffer, 'uploads', 'jpg');
    const res = await this.imageService.extractTextFromImage(
      filePath,
      !prompt ? undefined : prompt.value,
    );
    return res;
  }

  @Get('image-generation/:fileId')
  async imageGenerationGetter(
    @Param('fileId', ParseUUIDPipe) fileId: string,
    @Res() res: FastifyReply,
  ) {
    const buffer = await this.imageService.imageGenerationGetter(fileId);
    res.type('image/png').send(buffer);
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

    if (!file.filename.endsWith('jpg')) {
      throw new BadRequestException(
        'Invalid file type. Only .jpg files are allowed',
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
