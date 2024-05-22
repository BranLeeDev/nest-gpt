import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Voice } from '../../models';

export class TextToAudioDto {
  @ApiProperty({
    description: 'The text to be converted to audio',
    minLength: 3,
    example: 'Hello, world!',
  })
  @IsString()
  @MinLength(3)
  readonly prompt: string;

  @ApiProperty({
    description: 'The voice to use for the audio conversion',
    enum: Voice,
    default: Voice.ALLOY,
    example: Voice.ECHO,
  })
  @IsEnum(Voice)
  @IsOptional()
  readonly voice: Voice = Voice.ALLOY;
}
