import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class OrthographyDto {
  @IsString()
  @MinLength(3)
  readonly prompt: string;

  @IsInt()
  @Min(0)
  @Max(150)
  @IsOptional()
  readonly maxTokens: number = 150;
}
