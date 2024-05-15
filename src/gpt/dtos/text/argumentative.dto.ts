import { IsString, MinLength } from 'class-validator';

export class ArgumentativeDto {
  @IsString()
  @MinLength(3)
  readonly prompt: string;
}
