import { IsOptional } from 'class-validator';

export class CreateUserDto {
  nickname: string;

  linkNickname: string;

  email: string;

  password: string;

  phone: string;

  @IsOptional()
  photo =
    'https://i.pinimg.com/564x/16/3e/39/163e39beaa36d1f9a061b0f0c5669750.jpg';

  firstName: string;

  @IsOptional()
  lastName: string;

  birthday: number;

  @IsOptional()
  firstVerification? = false;
}
