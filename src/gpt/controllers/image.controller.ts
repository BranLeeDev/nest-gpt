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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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

  @ApiCreatedResponse({
    description: 'A new image generation is created successfully',
  })
  @ApiBadRequestResponse({
    description: 'An error ocurred',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many request. PLease try again later',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    const res = await this.imageService.imageGeneration(imageGenerationDto);
    return res;
  }

  @ApiCreatedResponse({
    description: 'A new image variation has been created successfully',
  })
  @ApiBadRequestResponse({
    description: 'An error ocurred',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many request. PLease try again later',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('image-variation')
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    const res = await this.imageService.imageVariation(imageVariationDto);
    return res;
  }

  @ApiCreatedResponse({
    description: 'A new image masking operation has been successfully executed',
  })
  @ApiBadRequestResponse({
    description: 'An error ocurred',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many request. PLease try again later',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('image-masking')
  async imageMasking(@Body() imageMaskingDto: ImageMaskingDto) {
    const res = await this.imageService.imageMasking(imageMaskingDto);
    return res;
  }

  @ApiCreatedResponse({
    description:
      'A new text extraction operation has been successfully executed from an image',
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

  @ApiOkResponse({ description: 'The generated image' })
  @ApiBadRequestResponse({
    description: 'An error ocurred',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many request. PLease try again later',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
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
