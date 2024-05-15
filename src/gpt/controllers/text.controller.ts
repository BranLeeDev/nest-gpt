import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { ArgumentativeDto, OrthographyDto } from '../dtos';
import { TextService } from '../services/text.service';

@Controller('text')
export class TextController {
  private readonly logger = new Logger(TextController.name);

  constructor(private readonly textService: TextService) {}

  @Post('orthography-check')
  async orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    const res = await this.textService.orthographyCheck(orthographyDto);
    return res;
  }

  @Post('pros-cons-argumentative')
  async prosConsArgumentative(@Body() argumentativeDto: ArgumentativeDto) {
    const res = await this.textService.prosConsArgumentative(argumentativeDto);
    return res;
  }

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
}
