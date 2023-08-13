import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserCreatedEvent } from './events/user-created.event';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  getFollowersOfUser(userId: string) {
    return this.prisma.user.findMany({
      where: { id: userId },
      include: { Followers: true },
    });
  }

  async createUser(userDto: CreateUserDto) {
    console.log(userDto.birthday);
    const newUser = await this.prisma.user.create({
      data: {
        nickname: userDto.nickname,
        linkNickname: userDto.linkNickname,
        birthday: new Date(Number(userDto.birthday)),
        email: userDto.email,
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        photo: userDto.photo,
        phone: userDto.phone,
      },
    });

    return newUser.id;
  }
}
