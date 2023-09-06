import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class EditCommentDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  id: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 600)
  text: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  replyTo?: string;
}
