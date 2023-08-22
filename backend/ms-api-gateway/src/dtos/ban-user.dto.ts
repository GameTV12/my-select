import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class BanUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  unlockTime: number;
}
