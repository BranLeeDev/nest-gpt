import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'The ID of the thread to which the message belongs',
    minLength: 7,
  })
  @IsString()
  @MinLength(7)
  readonly threadId: string;

  @ApiProperty({
    description: 'The question to be answered in the message',
    minLength: 3,
    example: 'What is the valid delivery time for a product?',
  })
  @IsString()
  @MinLength(3)
  readonly question: string;
}
