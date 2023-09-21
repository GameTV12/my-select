import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckDto {
  @ApiProperty({
    description: 'Text of email/link',
    example: 'linkUser123',
  })
  @IsNotEmpty()
  @IsString()
  value: string;

  @ApiProperty({
    description: 'linkNickname or email',
    example: 'linkNickname',
  })
  @IsNotEmpty()
  @IsString()
  type: string;
}
