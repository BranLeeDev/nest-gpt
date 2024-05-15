import { IsEnum, IsString, MinLength } from 'class-validator';
import { Lang } from '../../models';

export class TranslateDto {
  @IsString()
  @MinLength(3)
  readonly prompt: string;

  @IsEnum(Lang)
  readonly lang: Lang;
}
