import { Body, Controller, Post } from '@nestjs/common';
import { TextService } from '../services/text.service';
import { ArgumentativeDto, OrthographyDto } from '../dtos';

@Controller('text')
export class TextController {
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
}
