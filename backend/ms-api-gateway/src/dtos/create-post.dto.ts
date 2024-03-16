import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
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

  @ApiProperty({
    description: 'Photos',
    example: 'photo.jpg',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(400, { each: true })
  @ArrayMaxSize(10)
  photos?: string[];

  @ApiProperty({
    description: 'Video from youtube',
    example: 'youtube.com/',
  })
  @IsOptional()
  @IsString()
  @Length(1, 300)
  video?: string;

  @ApiProperty({
    description: 'Comment are allowed or not',
    example: 'true',
  })
  @IsNotEmpty()
  @IsBoolean()
  commentsAllowed = true;

  @ApiProperty({
    description: 'Adding variants are allowed or not',
    example: 'false',
  })
  @IsOptional()
  @IsBoolean()
  variantsAllowed?: boolean;

  @ApiProperty({
    description: 'Photos',
    example: 'photo.jpg',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  @ArrayMaxSize(10)
  variants?: string[];
}
