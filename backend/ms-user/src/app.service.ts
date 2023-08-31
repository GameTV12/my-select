import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateModeratorRequestDto, CreateUserDto, EditUserDto } from './dtos';
import { CreateReportDto, DecideRequestsDto } from './dtos';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

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
        firstVerification: userDto.firstVerification,
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

  // // Your followers
  // async getFullFollowers(userId: string) {
  //   //later
  //   const followers = await this.prisma.followers.findMany({
  //     where: {
  //       AND: [{ following: userId }],
  //     },
  //   });
  //   return followers;
  // }

  // You follow them
  async getFullFollowings(userId: string) {
    //later
    const followers = await this.prisma.followers.findMany({
      where: {
        AND: [{ follower: userId }, { end: null }],
      },
    });
    return followers;
  }

  async createModeratorRequest({ userId, text }: CreateModeratorRequestDto) {
    const request = await this.prisma.request.create({
      data: {
        userId,
        text,
      },
    });

    return request;
  }

  async showModeratorRequestsById(userId: string) {
    const requests = await this.prisma.request.findMany({
      where: {
        userId,
      },
    });
    return requests;
  }

  async showWaitingRequests() {
    const requests = await this.prisma.request.findMany({
      where: {
        status: 'WAITING',
      },
    });
    return requests;
  }

  async decideRequest({ requestId, adminId, decision }: DecideRequestsDto) {
    let status;
    if (decision == 'ACCEPTED') status = 'ACCEPTED';
    else status = 'DENIED';
    const decidedRequest = await this.prisma.request.update({
      where: {
        id: requestId,
      },
      data: {
        courtId: adminId,
        status: status,
      },
    });
    if (decision == 'ACCEPTED') {
      const userId: string = decidedRequest.userId;
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: 'MODERATOR',
        },
      });
    }
    return decidedRequest;
  }

  async createReport({ senderId, reportedUserId, text }: CreateReportDto) {
    const report = await this.prisma.report.create({
      data: {
        senderId: senderId,
        reportedUserId: reportedUserId,
        text: text,
      },
    });
    return report;
  }

  async showReports() {
    const report = await this.prisma.report.findMany();
    return report;
  }

  async banUser(userId: string, unlockTime: number) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        visible: false,
        unlockTime: new Date(Number(unlockTime)),
        role: 'BANNED_USER',
      },
    });
    return user;
  }
}
