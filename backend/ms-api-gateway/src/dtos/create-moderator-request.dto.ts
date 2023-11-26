import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModeratorRequestDto {
  @ApiProperty({
    description: 'Moderator request',
    example: "Hello, I wanna become a moderator, because I'm the best",
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 300)
  text: string;
}
