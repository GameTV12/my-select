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
  nickname: string;

  @IsOptional()
  @IsString()
  @Length(2, 30)
  linkNickname: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsOptional()
  @IsString()
  @Length(6, 40)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  photo;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  lastName: string;

  @IsOptional()
  birthday: number;
}
