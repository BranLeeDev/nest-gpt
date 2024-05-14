import {
  IsEnum,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Environment } from '../../models';

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  @MinLength(30)
  @MaxLength(100)
  OPENAI_SECRET_KEY: string;
}
