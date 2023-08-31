import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateModeratorRequestDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 300)
  text: string;
}
