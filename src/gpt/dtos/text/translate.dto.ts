import { IsEnum, IsString, MinLength } from 'class-validator';
import { Lang } from '../../models';
import { ApiProperty } from '@nestjs/swagger';

export class TranslateDto {
  @ApiProperty({
    description: 'The text prompt to be translated',
    minLength: 3,
    example: 'Hello, how are you?',
  })
  @IsString()
  @MinLength(3)
  readonly prompt: string;

  @ApiProperty({
    description: 'The target language for the translation',
    enum: Lang,
    example: Lang.SPANISH,
  })
  @IsEnum(Lang)
  readonly lang: Lang;
}
