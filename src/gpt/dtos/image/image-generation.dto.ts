import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ImageGenerationDto {
  @ApiProperty({
    description: 'A textual description or prompt for generating an image',
    minLength: 3,
    example: 'Generate an image of a futuristic city skyline at sunset',
  })
  @IsString()
  @MinLength(3)
  readonly prompt: string;
}
