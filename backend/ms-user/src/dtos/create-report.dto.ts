import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  senderId: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  text: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  reportedUserId: string;
}
