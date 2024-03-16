import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

enum Type {
  POST = 'POST',
  VARIANT = 'VARIANT',
}

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  userId: string;

  @IsEnum(Type)
  @IsNotEmpty()
  type: Type;

  @IsNotEmpty()
  @IsString()
  @Length(2, 600)
  text: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  goalId: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  replyTo?: string;
}
