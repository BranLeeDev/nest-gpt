import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { FastifyReply } from 'fastify';
import { ArgumentativeDto, OrthographyDto, TranslateDto } from '../dtos';
import { TextService } from '../services/text.service';

@ApiTags('text')
@Controller('text')
export class TextController {
  private readonly logger = new Logger(TextController.name);

  constructor(private readonly textService: TextService) {}

  @ApiCreatedResponse({ description: 'Orthography check successful' })
  @ApiResponse({
    status: 429,
    description: 'Too many request. PLease try again later',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('orthography-check')
  async orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    const res = await this.textService.orthographyCheck(orthographyDto);
    return res;
  }

  @ApiCreatedResponse({ description: 'Argumentative text analysis successful' })
  @ApiResponse({
    status: 429,
    description: 'Too many request. PLease try again later',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('pros-cons-argumentative')
  async prosConsArgumentative(@Body() argumentativeDto: ArgumentativeDto) {
    const res = await this.textService.prosConsArgumentative(argumentativeDto);
    return res;
  }

  @ApiOkResponse({
    description:
      'Successful response to pros-cons-argumentative-stream request',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many request. PLease try again later',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('pros-cons-argumentative-stream')
  @HttpCode(HttpStatus.OK)
  async prosConsArgumentativeStream(
    @Body() argumentativeDto: ArgumentativeDto,
    @Res() res: FastifyReply,
  ) {
    const stream =
      await this.textService.prosConsArgumentativeStream(argumentativeDto);
    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      res.raw.write(piece);
    }
    res.raw.end();
    this.logger.log('Pros-cons argumentative (stream) completed');
  }

  @ApiCreatedResponse({ description: 'Translation successful' })
  @ApiResponse({
    status: 429,
    description: 'Too many request. PLease try again later',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('translate')
  async translate(@Body() translateDto: TranslateDto) {
    const res = await this.textService.translate(translateDto);
    return res;
  }

  @ApiOkResponse({
    description: 'Successful response to translation stream request',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many request. PLease try again later',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('translate-stream')
  @HttpCode(HttpStatus.OK)
  async translateStream(
    @Body() translateDto: TranslateDto,
    @Res() res: FastifyReply,
  ) {
    const stream = await this.textService.translateStream(translateDto);
    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      res.raw.write(piece);
    }
    res.raw.end();
    this.logger.log('Translation stream established successfully');
  }
}
