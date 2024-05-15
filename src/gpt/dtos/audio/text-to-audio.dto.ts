import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Voice } from '../../models';

export class TextToAudioDto {
  @IsString()
  @MinLength(3)
  readonly prompt: string;

  @IsEnum(Voice)
  @IsOptional()
  readonly voice: Voice = Voice.ALLOY;
}
