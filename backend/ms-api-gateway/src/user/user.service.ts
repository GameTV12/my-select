import {
  ForbiddenException,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateModeratorRequestDto,
  CreateReportDto,
  DecideRequestsDto,
  Decision,
} from '../dtos';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
    private prisma: PrismaService,
  ) {}

  async getUserByNickname(linkNickname: string) {
    const answerUser = await new Promise((resolve) => {
      this.userClient.send('get_nickname', linkNickname).subscribe((data) => {
        resolve(data);
      });
    });
    return answerUser;
  }

  async followToUser(from: string, to: string) {
    console.log(from);
    const userTo = await this.prisma.authUser.findUnique({
      where: {
        userId: to,
      },
    });
    if (from == to || !userTo) throw new ForbiddenException('Access denied');

    const subscription = await new Promise((resolve) => {
      this.userClient
        .send('follow_to_user', { from: from, to: to })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return subscription;
  }

  async getCurrentFollowers(linkNickname: string) {
    const user = await this.prisma.authUser.findUnique({
      where: {
        linkNickname: linkNickname,
      },
    });
    if (!user) throw new ForbiddenException('Access denied');
    const userId = user.userId;

    const followers = await new Promise((resolve) => {
      this.userClient
        .send('get_current_followers', userId)
        .subscribe((data) => {
          resolve(data);
        });
    });
    return followers;
  }

  async getFullFollowings(linkNickname: string) {
    const user = await this.prisma.authUser.findUnique({
      where: {
        linkNickname: linkNickname,
      },
    });
    if (!user) throw new ForbiddenException('Access denied');
    const userId = user.userId;

    const followings = await new Promise((resolve) => {
      this.userClient.send('get_full_followings', userId).subscribe((data) => {
        resolve(data);
      });
    });
    return followings;
  }

  async createModeratorRequest(userId: string, text: string) {
    const newRequest = await new Promise((resolve) => {
      this.userClient
        .send('create_moderator_request', { userId: userId, text: text })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return newRequest;
  }

  async showModeratorRequestsById(linkNickname: string) {
    const user = await this.prisma.authUser.findUnique({
      where: {
        linkNickname,
      },
    });
    const requests = await new Promise((resolve) => {
      this.userClient
        .send('show_moderator_request_id', user.userId)
        .subscribe((data) => {
          resolve(data);
        });
    });
    return requests;
  }

  async showWaitingRequests() {
    const requests = await new Promise((resolve) => {
      this.userClient.send('show_waiting_requests', null).subscribe((data) => {
        resolve(data);
      });
    });
    return requests;
  }

  async decideRequest(requestId: string, adminId: string, decision: Decision) {
    const dto: DecideRequestsDto = {
      requestId: requestId,
      adminId: adminId,
      decision: decision,
    };
    const newModerator: any = await new Promise((resolve) => {
      this.userClient.send('decide_request', dto).subscribe((data) => {
        resolve(data);
      });
    });
    if (newModerator.role == 'MODERATOR') {
      this.prisma.authUser.update({
        where: {
          userId: newModerator.id,
        },
        data: {
          role: 'MODERATOR',
        },
      });
    }
    return newModerator;
  }

  async createReport(
    senderId: string,
    { reportedUserId, text }: CreateReportDto,
  ) {
    const userReport = await this.prisma.authUser.findUnique({
      where: {
        userId: reportedUserId,
      },
    });
    if (!userReport) throw new NotFoundException('User not found');

    const report = await new Promise((resolve) => {
      this.userClient
        .send('create_report', { senderId, reportedUserId, text })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return report;
  }

  async showReports() {
    const reports = await new Promise((resolve) => {
      this.userClient.send('show_reports', null).subscribe((data) => {
        resolve(data);
      });
    });
    return reports;
  }

  async banUser(userId: string, unlockTime: number) {
    const bannedUser = await new Promise((resolve) => {
      this.userClient
        .send('ban_user', { userId: userId, unlockTime: unlockTime })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return bannedUser;
  }
}
