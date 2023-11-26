import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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
  @IsNotEmpty()
  @IsString()
  @Length(6, 40)
  password: string;

  @ApiProperty({
    description: 'Phone',
    example: '+420123456789',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  phone: string;

  @ApiProperty({
    description: 'Photo',
    example:
      'https://i.pinimg.com/564x/46/72/f8/4672f876389036583190d93a71aa6cb2.jpg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  photo? =
    'https://i.pinimg.com/564x/46/72/f8/4672f876389036583190d93a71aa6cb2.jpg';

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
  lastName?: string;

  @ApiProperty({
    description: 'Birthday',
    example: '659544672',
  })
  @IsNotEmpty()
  birthday: number;

  @ApiProperty({
    description: 'First verification',
    example: 'true',
  })
  @IsOptional()
  firstVerification? = false;
}
