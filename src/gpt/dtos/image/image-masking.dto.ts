import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ImageMaskingDto {
  @ApiProperty({
    description: 'A prompt describing the image masking task',
    minLength: 3,
    example: 'Replace the blue eye with a red eye',
  })
  @IsString()
  @MinLength(3)
  readonly prompt: string;

  @ApiProperty({
    description: 'URL of the original image to be masked',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  readonly originalImageUrl: string;

  @ApiProperty({
    description: 'Base64 encoded string of the mask image',
    minLength: 100,
  })
  @IsString()
  @MinLength(100)
  readonly maskImageBase64: string;
}
