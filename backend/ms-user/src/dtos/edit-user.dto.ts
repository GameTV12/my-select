import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 80)
  nickname?: string;

  @IsOptional()
  @IsString()
  @Length(2, 30)
  linkNickname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  photo?;
}
