import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class OrthographyDto {
  @IsString()
  @MinLength(3)
  readonly prompt: string;

  @IsInt()
  @IsOptional()
  readonly maxTokens: number = 150;
}
