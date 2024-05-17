import { Body, Controller, Post } from '@nestjs/common';
import { ImageGenerationDto } from '../dtos';
import { ImageService } from '../services/image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    const res = await this.imageService.imageGeneration(imageGenerationDto);
    return res;
  }
}
