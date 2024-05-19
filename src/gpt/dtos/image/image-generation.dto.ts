import { IsString } from 'class-validator';

export class ImageGenerationDto {
  @IsString()
  readonly prompt: string;
}
