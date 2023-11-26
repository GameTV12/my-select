import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({
    description: 'Text of report',
    example: 'Please ban this user',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  text: string;

  @ApiProperty({
    description: 'Id of user, who was reported',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  reportedUserId: string;
}
