import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ArgumentativeDto {
  @ApiProperty({
    description: 'A prompt asking for a comparison or argumentation',
    minLength: 3,
    example: 'Which is better, a laptop or a PC?',
  })
  @IsString()
  @MinLength(3)
  readonly prompt: string;
}
