import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateModeratorRequestDto, CreateUserDto, EditUserDto } from './dtos';
import { CreateReportDto, DecideRequestsDto } from './dtos';

export type Statistics = {
  time: number;
  parameter: number;
  realParameter: number;
};

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
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        nickname: userDto.nickname,
        linkNickname: userDto.linkNickname,
        photo: userDto.photo,
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
        id: true,
        nickname: true,
        linkNickname: true,
        photo: true,
        firstName: true,
        lastName: true,
        visible: true,
        birthday: true,
        secondVerification: true,
        createdAt: true,
        role: true,
        _count: {
          select: {
            Followers: {
              where: {
                end: null,
              },
            },
          },
        },
      },
    });
    return user;
  }

  async getUserInfo(linkNickname: string, viewerId?: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        linkNickname: linkNickname,
      },
      select: {
        id: true,
        nickname: true,
        linkNickname: true,
        photo: true,
        visible: true,
        secondVerification: true,
        createdAt: true,
        role: true,
        _count: {
          select: {
            Followers: {
              where: {
                end: null,
              },
            },
          },
        },
      },
    });
    let subscribed = false;
    if (viewerId) {
      const userSubscribers = await this.prisma.followers.findMany({
        where: {
          follower: viewerId,
          following: user.id,
          end: null,
        },
      });
      if (userSubscribers.length > 0) subscribed = true;
    }
    return { ...user, subscribed };
  }

  async followToUser(from: string, to: string) {
    const checkSubscription = await this.prisma.followers.findMany({
      where: {
        AND: [{ follower: from }, { following: to }],
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

  async getFullFollowers(linkNickname: string) {
    const searchedUser = await this.prisma.user.findUnique({
      where: {
        linkNickname,
      },
    });
    if (!searchedUser) return null;
    const answer: Statistics[] = [];
    const endDate = new Date().setUTCHours(0, 0, 0, 0);
    const startDate = searchedUser.createdAt.setUTCHours(0, 0, 0, 0);
    const rawReactions = await this.prisma.followers.findMany({
      where: { following: searchedUser.id },
      orderBy: {
        start: 'asc',
      },
      select: {
        followerUser: {
          select: {
            secondVerification: true,
          },
        },
        start: true,
        end: true,
      },
    });
    const reactions = rawReactions.map((item) => ({
      startTime: item.start.getTime(),
      endTime: item.end ? item.end.getTime() : null,
      verification: item.followerUser.secondVerification,
    }));
    for (let i = startDate; i <= endDate; i += 3600 * 24 * 1000) {
      const currentDayData = reactions.filter(
        (item) =>
          item.startTime <= i && (item.endTime == null || item.endTime >= i),
      );
      const overallData = currentDayData.length;
      const verifiedData = currentDayData.filter(
        (item) => item.verification,
      ).length;
      answer.push({
        time: i,
        parameter: overallData,
        realParameter: verifiedData,
      });
    }

    return answer;
  }

  async getFullFollowings(userId: string) {
    const followers = await this.prisma.followers.findMany({
      where: {
        AND: [{ follower: userId }, { end: null }],
      },
      select: {
        followingUser: {
          select: {
            linkNickname: true,
            nickname: true,
            photo: true,
            id: true,
            _count: { select: { Followers: { where: { end: null } } } },
          },
        },
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
        user: {
          visible: true,
          role: 'DEFAULT_USER',
        },
      },
      select: {
        id: true,
        user: {
          select: {
            nickname: true,
            linkNickname: true,
            photo: true,
          },
        },
        text: true,
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
    let newModerator;
    const userId: string = decidedRequest.userId;
    if (decision == 'ACCEPTED') {
      newModerator = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: 'MODERATOR',
          secondVerification: true,
        },
      });
    } else {
      newModerator = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
    }
    return newModerator;
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
    const reports = await this.prisma.report.findMany();
    return reports;
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

  async firstVerify(linkNickname: string) {
    const user = await this.prisma.user.update({
      where: {
        linkNickname,
      },
      data: {
        firstVerification: true,
      },
    });
    return user;
  }

  async secondVerify(id: string) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        firstVerification: true,
        secondVerification: true,
      },
    });
    return user;
  }

  async cancelModerator(id: string) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        role: 'DEFAULT_USER',
      },
    });
    return user;
  }
}
