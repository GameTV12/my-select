import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogInDto {
  @ApiProperty({
    description: 'Email of user',
    example: 'perkins@mail.dknaaa',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    description: 'Password of user',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 40)
  password: string;
}
