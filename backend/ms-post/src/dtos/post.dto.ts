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

export class PostDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 160)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 10000)
  text: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(400, { each: true })
  @ArrayMaxSize(10)
  photos?: string[];

  @IsOptional()
  @IsString()
  @Length(1, 300)
  video?: string;

  @IsNotEmpty()
  @IsBoolean()
  commentsAllowed = true;

  @IsOptional()
  @IsBoolean()
  variantsAllowed?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  @ArrayMaxSize(10)
  variants?: string[];
}
