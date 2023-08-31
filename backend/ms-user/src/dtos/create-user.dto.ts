import { IsOptional } from 'class-validator';

export class CreateUserDto {
  nickname: string;

  linkNickname: string;

  email: string;

  password: string;

  phone: string;

  @IsOptional()
  photo =
    'https://i.pinimg.com/564x/46/72/f8/4672f876389036583190d93a71aa6cb2.jpg';

  firstName: string;

  @IsOptional()
  lastName: string;

  birthday: number;

  @IsOptional()
  firstVerification? = false;
}
