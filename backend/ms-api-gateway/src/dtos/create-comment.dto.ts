import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Text of comment',
    example: 'Comment text',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 600)
  text: string;

  @ApiProperty({
    description: 'Id of post/comment',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  goalId: string;

  @ApiProperty({
    description: 'Id of replied comment',
    example: '1',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  replyTo?: string;
}
