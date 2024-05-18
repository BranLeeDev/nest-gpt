import { IsString, IsUrl, MinLength } from 'class-validator';

export class ImageVariationDto {
  @IsString()
  @IsUrl()
  @MinLength(10)
  readonly baseImageUrl: string;
}
