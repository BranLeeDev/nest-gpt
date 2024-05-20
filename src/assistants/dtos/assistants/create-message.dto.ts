import { IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(7)
  readonly threadId: string;

  @IsString()
  @MinLength(3)
  readonly question: string;
}
