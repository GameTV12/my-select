import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateUserDto, EditUserDto } from './dtos';
import { RpcException } from '@nestjs/microservices';

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

  async updateUser(userDto: EditUserDto, userId: string) {
    let birthday: Date;
    if (userDto.birthday) {
      birthday = new Date(Number(userDto.birthday));
    } else {
      const newUser = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      birthday = newUser.birthday;
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        nickname: userDto.nickname,
        linkNickname: userDto.linkNickname,
        birthday: birthday,
        email: userDto.email,
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        photo: userDto.photo,
        phone: userDto.phone,
      },
    });
    return true;
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async getUserByLinkNickname(linkNickname: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        linkNickname: linkNickname,
      },
      select: {
        nickname: true,
        linkNickname: true,
        photo: true,
        firstName: true,
        lastName: true,
        visible: true,
        birthday: true,
        secondVerification: true,
      },
    });
    return user;
  }

  async followToUser(from: string, to: string) {
    const checkSubscription = await this.prisma.followers.findMany({
      where: {
        AND: { follower: from, following: to },
      },
      orderBy: {
        start: 'desc',
      },
      take: 1,
    });

    let newSubscription;
    if (checkSubscription.length > 0 && checkSubscription[0].end == null) {
      newSubscription = await this.prisma.followers.update({
        where: {
          follower_following_start: {
            follower: from,
            following: to,
            start: checkSubscription[0].start,
          },
        },
        data: {
          end: new Date(),
        },
      });
    } else {
      newSubscription = await this.prisma.followers.create({
        data: {
          follower: from,
          following: to,
          start: new Date(),
        },
      });
    }

    return newSubscription;
  }

  async getCurrentFollowers(userId: string) {
    const followers = await this.prisma.followers.findMany({
      where: {
        AND: [{ following: userId }, { end: null }],
      },
    });
    return followers;
  }

  async getFullFollowers(userId: string) {
    const followers = await this.prisma.followers.findMany({
      where: {
        AND: [{ following: userId }],
      },
    });
    return followers;
  }
}
