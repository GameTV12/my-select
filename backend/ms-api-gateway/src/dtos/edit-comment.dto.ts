import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditCommentDto {
  @ApiProperty({
    description: 'Id of comment',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  id: string;

  @ApiProperty({
    description: 'New text of comment',
    example: "Hello it's a new text of comment",
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 600)
  text: string;

  @ApiProperty({
    description: 'Id of replied comment',
    example: '1',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  replyTo?: string;
}
