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

export class GetCommentDto {
  id: string;

  userId: string;

  @IsEnum(Type)
  type: Type;

  text: string;

  goalId: string;

  replyTo?: string;

  createdAt: number;

  likes: number;

  dislikes: number;
}
