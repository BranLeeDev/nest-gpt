import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, MinLength } from 'class-validator';

export class ImageVariationDto {
  @ApiProperty({
    description: 'The base image URL',
    minLength: 10,
  })
  @IsString()
  @IsUrl()
  @MinLength(10)
  readonly baseImageUrl: string;
}
