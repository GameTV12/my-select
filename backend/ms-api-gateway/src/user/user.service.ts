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

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
    private prisma: PrismaService,
  ) {}

  async getUserByNickname(linkNickname: string) {
    const user = await this.prisma.authUser.findUnique({
      where: {
        linkNickname: linkNickname,
      },
    });
    console.log(user);
    console.log(linkNickname);
    if (!user) throw new NotFoundException('Not found');
    const answerUser = await new Promise((resolve) => {
      this.userClient.send('get_nickname', linkNickname).subscribe((data) => {
        resolve(data);
      });
    });
    return answerUser;
  }

  async followToUser(from: string, to: string) {
    console.log(from);
    const user = await this.prisma.authUser.findUnique({
      where: {
        userId: from,
      },
    });
    const userTo = await this.prisma.authUser.findUnique({
      where: {
        userId: to,
      },
    });
    if (!user || !user.hashedRt || from == to || !userTo)
      throw new ForbiddenException('Access denied');

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
}
