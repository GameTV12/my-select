import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditUserDto {
  @ApiProperty({
    description: 'New nickname of user',
    example: 'New nickname',
  })
  @IsOptional()
  @IsString()
  @Length(2, 80)
  nickname?: string;

  @ApiProperty({
    description: 'New likcnickname of user',
    example: 'new_link_nickname',
  })
  @IsOptional()
  @IsString()
  @Length(2, 30)
  linkNickname?: string;

  @ApiProperty({
    description: 'New email of user',
    example: 'useremail@mail.com',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    description: 'New password of user',
    example: 'new123456Ab',
  })
  @IsOptional()
  @IsString()
  @Length(6, 40)
  password?: string;

  @ApiProperty({
    description: 'New phone of user',
    example: '+420123456700',
  })
  @IsOptional()
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
  photo?;

  @ApiProperty({
    description: 'First name',
    example: 'Jan',
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  firstName?: string;

  @ApiProperty({
    description: 'Last (family) name',
    example: 'Novak',
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  lastName?: string;

  @ApiProperty({
    description: 'Birthday',
    example: '559544672',
  })
  @IsOptional()
  @IsNumber()
  birthday: number;
}
