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
  nickname: string;

  @ApiProperty({
    description: 'Photo',
    example:
      'https://i.pinimg.com/564x/16/3e/39/163e39beaa36d1f9a061b0f0c5669750.jpg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  photo?;
}
