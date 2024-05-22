import { IsString, MinLength } from 'class-validator';

export class ImageMaskingDto {
  @IsString()
  @MinLength(3)
  readonly prompt: string;

  @IsString()
  @MinLength(10)
  readonly originalImageUrl: string;

  @IsString()
  @MinLength(100)
  readonly maskImageBase64: string;
}
