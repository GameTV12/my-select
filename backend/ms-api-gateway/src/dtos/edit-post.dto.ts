import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditPostDto {
  @ApiProperty({
    description: 'Title of post',
    example: 'Post title of test',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 160)
  title: string;

  @ApiProperty({
    description: 'Text of post',
    example: "Hello it's the text",
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 10000)
  text: string;
}
