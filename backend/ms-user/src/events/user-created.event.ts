import { CreateUserDto } from '../dtos/create-user.dto';

export class UserCreatedEvent {
  constructor(
    public readonly dto: CreateUserDto,
    public readonly password: string,
  ) {}

  toString() {
    return JSON.stringify({
      nickname: this.dto.nickname,
      linkNickname: this.dto.linkNickname,
      password: this.password,
      email: this.dto.email,
      photo: this.dto.photo,
      phone: this.dto.phone,
      lastName: this.dto.lastName,
      firstName: this.dto.firstName,
      birthdate: this.dto.birthday,
    });
  }
}
