import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class OrthographyDto {
  @ApiProperty({
    description: 'A prompt asking for orthographic correction or analysis',
    minLength: 3,
    example: 'aqui ai traveja duro tdo el dia',
  })
  @IsString()
  @MinLength(3)
  readonly prompt: string;

  @ApiProperty({
    description: 'Maximum number of tokens for the response',
    minimum: 0,
    maximum: 150,
    default: 150,
    example: 100,
  })
  @IsInt()
  @Min(0)
  @Max(150)
  @IsOptional()
  readonly maxTokens: number = 150;
}
