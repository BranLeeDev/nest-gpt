import { IsString, MinLength } from 'class-validator';

export class ImageGenerationDto {
  @IsString()
  @MinLength(3)
  readonly prompt: string;
}
