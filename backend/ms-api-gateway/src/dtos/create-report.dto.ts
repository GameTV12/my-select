import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  text: string;

  @IsNotEmpty()
  @IsString()
  reportedUserId: string;
}
