import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty({
    description: 'Id of user',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Nickname',
    example: 'nickname123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 80)
  nickname: string;

  @ApiProperty({
    description: 'Link nickname',
    example: 'link_nickname123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  linkNickname: string;

  @ApiProperty({
    description: 'Email',
    example: 'emailuser@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    description: 'Password',
    example: '123456Ab',
  })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  photo: string;

  @ApiProperty({
    description: 'First name of user',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  firstName: string;

  @ApiProperty({
    description: 'Last name of user',
    example: 'Smith',
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  lastName: string;

  @ApiProperty({
    description: 'Birthday',
    example: '659544672',
  })
  @IsNotEmpty()
  @IsInt()
  birthday: number;
}
