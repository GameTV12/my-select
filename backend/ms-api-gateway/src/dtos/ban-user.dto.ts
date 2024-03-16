import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BanUserDto {
  @ApiProperty({
    description: 'Id of user',
    example: '13325c-asfsd1-8ccsdf2-1209fsd0',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  userId: string;

  @ApiProperty({
    description: 'Time, where user will be unlocked',
    example: '1695694841',
  })
  @IsNotEmpty()
  @IsNumber()
  unlockTime: number;
}
