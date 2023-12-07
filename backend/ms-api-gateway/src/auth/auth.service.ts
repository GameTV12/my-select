import {
  BadGatewayException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { EditUserDto, LogInDto, CreateUserDto } from '../dtos';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('USER_SERVICE') private readonly authClient: ClientKafka,
    @Inject('COMMENT_SERVICE') private readonly commentClient: ClientKafka,
    @Inject('POST_SERVICE') private readonly postClient: ClientKafka,
    private readonly mailerService: MailerService,
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async signupLocal(dto: CreateUserDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

    const possibleUser = await this.prisma.authUser.findUnique({
      where: {
        linkNickname: dto.linkNickname,
      },
    });

    if (possibleUser) {
      return this.signinLocal({ password: dto.password, email: dto.email });
    }

    const realUserId: string = await new Promise((resolve) => {
      this.authClient
        .send('create_user', {
          dto: dto,
          pass: hash,
        })
        .subscribe((data) => {
          resolve(data);
        });
    });

    const newUser = await this.prisma.authUser.create({
      data: {
        userId: realUserId,
        nickname: dto.nickname,
        photo: dto.photo,
        linkNickname: dto.linkNickname,
        password: hash,
        email: dto.email,
      },
    });

    const postAndCommentUser = {
      userId: realUserId,
      nickname: dto.nickname,
      photo: dto.photo,
      linkNickname: dto.linkNickname,
    };

    await new Promise((resolve) => {
      this.postClient
        .send('post_create_user', postAndCommentUser)
        .subscribe((data) => {
          resolve(data);
        });
    });

    await new Promise((resolve) => {
      this.commentClient
        .send('comment_create_user', postAndCommentUser)
        .subscribe((data) => {
          resolve(data);
        });
    });

    const tokens = await this.getTokens(
      newUser.userId,
      newUser.email,
      newUser.role,
      newUser.visible,
      newUser.firstVerification,
      newUser.secondVerification,
      newUser.linkNickname,
      newUser.unlockTime,
    );
    await this.updateRtHash(newUser.userId, tokens.refresh_token);
    await this.sendFirstLetter(newUser.email, newUser.linkNickname);
    return tokens;
  }

  async googleLogin(req) {
    if (!req.user) {
      throw new NotFoundException("User doesn't exist");
    }
    const user = await this.prisma.authUser.findUnique({
      where: {
        email: req.user.email,
      },
    });

    if (!user) {
      let randomLink = randomStringGenerator();
      while (
        await this.prisma.authUser.findUnique({
          where: {
            linkNickname: randomLink,
          },
        })
      ) {
        randomLink = randomStringGenerator();
      }

      const randomPassword = randomStringGenerator();
      const dto: CreateUserDto = {
        nickname: req.user.firstName,
        linkNickname: randomLink,
        email: req.user.email,
        password: randomPassword,
        phone: null,
        photo: req.user.photo,
        firstName: req.user.firstName,
        birthday: 1,
        firstVerification: true,
      };
      const hash = await this.hashData(dto.password);

      const realUserId: string = await new Promise((resolve) => {
        this.authClient
          .send('create_user', {
            dto: dto,
            pass: hash,
          })
          .subscribe((data) => {
            resolve(data);
          });
      });

      const newUser = await this.prisma.authUser.create({
        data: {
          userId: realUserId,
          nickname: dto.nickname,
          photo: req.user.photo,
          linkNickname: dto.linkNickname,
          password: hash,
          email: req.user.email,
          firstVerification: true,
        },
      });

      const tokens = await this.getTokens(
        newUser.userId,
        newUser.email,
        newUser.role,
        newUser.visible,
        newUser.firstVerification,
        newUser.secondVerification,
        newUser.linkNickname,
        newUser.unlockTime,
      );
      await this.updateRtHash(user.userId, tokens.refresh_token);

      return {
        message: 'You dont have this account',
        email: req.user.email,
        user: req.user,
        tokens: tokens,
      };
    }
    const tokens = await this.getTokens(
      user.userId,
      user.email,
      user.role,
      user.visible,
      user.firstVerification,
      user.secondVerification,
      user.linkNickname,
      user.unlockTime,
    );
    return {
      message: 'OK',
      user: req.user,
      tokens: tokens,
    };
  }

  async firstVerify(linkNickname: string) {
    const user = await this.prisma.authUser.findUnique({
      where: {
        linkNickname,
      },
    });
    if (!user) throw new ForbiddenException('Access Denied');
    const newUser = await this.prisma.authUser.update({
      where: {
        linkNickname,
      },
      data: {
        firstVerification: true,
      },
    });
    const remoteUser: string = await new Promise((resolve) => {
      this.authClient
        .send('first_verify_user', {
          linkNickname,
        })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return newUser;
  }

  async secondVerify(id: string) {
    const user = await this.prisma.authUser.findUnique({
      where: {
        userId: id,
      },
    });
    if (!user) throw new ForbiddenException('Access Denied');
    const newUser = await this.prisma.authUser.update({
      where: {
        userId: id,
      },
      data: {
        firstVerification: true,
        secondVerification: true,
      },
    });

    const remoteUser: string = await new Promise((resolve) => {
      this.authClient
        .send('second_verify_user', {
          id,
        })
        .subscribe((data) => {
          resolve(data);
        });
    });

    const postUser: string = await new Promise((resolve) => {
      this.postClient
        .send('post_verify_user', {
          id,
        })
        .subscribe((data) => {
          resolve(data);
        });
    });

    const commentUser: string = await new Promise((resolve) => {
      this.commentClient
        .send('comment_verify_user', {
          id,
        })
        .subscribe((data) => {
          resolve(data);
        });
    });

    return newUser;
  }

  async checkUniqueEmailOrLink(value: string, type: string) {
    let user;
    if (type == 'email') {
      user = await this.prisma.authUser.findUnique({
        where: {
          email: value,
        },
      });
    } else if (type == 'linkNickname') {
      user = await this.prisma.authUser.findUnique({
        where: {
          linkNickname: value,
        },
      });
    }
    return !!!user;
  }
  async signinLocal(dto: LogInDto): Promise<Tokens> {
    const user = await this.prisma.authUser.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');
    if (!user.firstVerification)
      throw new ForbiddenException("Email isn't verified");
    if (user.role == 'BANNED_USER')
      throw new ForbiddenException('You were banned');
    if (
      !user.secondVerification &&
      user.createdAt &&
      user.createdAt.getTime() + 90 * 24 * 3600 * 1000 < Date.now()
    )
      throw new ForbiddenException('You were banned for inactivity');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(
      user.userId,
      user.email,
      user.role,
      user.visible,
      user.firstVerification,
      user.secondVerification,
      user.linkNickname,
      user.unlockTime,
    );
    await this.updateRtHash(user.userId, tokens.refresh_token);
    if (
      !user.secondVerification &&
      user.emailSent == false &&
      user.createdAt.getTime() + 15 * 60 * 1000 < Date.now()
    ) {
      await this.sendSecondLetter(user.email, user.userId);
      await this.prisma.authUser.update({
        where: {
          userId: user.userId,
        },
        data: {
          emailSent: true,
        },
      });
    }
    return tokens;
  }
  async logout(userId: string) {
    await this.prisma.authUser.update({
      where: {
        userId: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.prisma.authUser.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    if (
      user.role == 'BANNED_USER' ||
      (!user.secondVerification &&
        user.createdAt &&
        user.createdAt.getTime() + 90 * 24 * 3600 * 1000 < Date.now())
    ) {
      return { access_token: null, refresh_token: null };
    }

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(
      user.userId,
      user.email,
      user.role,
      user.visible,
      user.firstVerification,
      user.secondVerification,
      user.linkNickname,
      user.unlockTime,
    );
    await this.updateRtHash(user.userId, tokens.refresh_token);

    if (
      !user.secondVerification &&
      user.emailSent == false &&
      user.createdAt.getTime() + 15 * 60 * 1000 < Date.now()
    ) {
      await this.sendSecondLetter(user.email, user.userId);
      await this.prisma.authUser.update({
        where: {
          userId: user.userId,
        },
        data: {
          emailSent: true,
        },
      });
    }

    return tokens;
  }
  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.authUser.update({
      where: {
        userId: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async updateUser(userId: string, dto: EditUserDto) {
    const user = await this.prisma.authUser.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!user) throw new ForbiddenException('Access Denied');
    const newUser = await this.prisma.authUser.update({
      where: {
        userId: userId,
      },
      data: {
        nickname: dto.nickname,
        photo: dto.photo,
      },
    });

    const answerUserService: boolean = await new Promise((resolve) => {
      this.authClient
        .send('update_user', {
          dto: dto,
          userId: userId,
        })
        .subscribe((data) => {
          resolve(data);
        });
    });

    const postAndCommentUser = {
      userId: userId,
      nickname: dto.nickname,
      photo: dto.photo,
    };

    await new Promise((resolve) => {
      this.postClient
        .send('post_update_user', postAndCommentUser)
        .subscribe((data) => {
          resolve(data);
        });
    });

    await new Promise((resolve) => {
      this.commentClient
        .send('comment_update_user', postAndCommentUser)
        .subscribe((data) => {
          resolve(data);
        });
    });

    if (!answerUserService) {
      throw new BadGatewayException('Problems with updating');
    }

    const tokens = await this.getTokens(
      newUser.userId,
      newUser.email,
      newUser.role,
      newUser.visible,
      newUser.firstVerification,
      newUser.secondVerification,
      newUser.linkNickname,
      newUser.unlockTime,
    );
    await this.updateRtHash(newUser.userId, tokens.refresh_token);
    return tokens;
  }

  async getCurrentUser(userId: string) {
    const answerUser = await new Promise((resolve) => {
      this.authClient.send('get_current_user', userId).subscribe((data) => {
        resolve(data);
      });
    });
    return answerUser;
  }

  async getTokens(
    userId: string,
    email: string,
    role: string,
    visible: boolean,
    firstVerification: boolean,
    secondVerification: boolean,
    linkNickname: string,
    unlockTime: any,
  ) {
    const payload = {
      id: userId,
      email: email,
      linkNickname: linkNickname,
      role: role,
      visible: visible,
      firstVerification: firstVerification,
      secondVerification: secondVerification,
      unlockTime: unlockTime || -1,
    };
    const secret = this.config.get('JWT_SECRET');

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: 45,
        secret: 'at-' + secret,
      }),
      this.jwt.signAsync(payload, {
        expiresIn: 90 * 3600 * 24,
        secret: 'rt-' + secret,
      }),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  async sendFirstLetter(email: string, link: string) {
    this.mailerService.sendMail({
      to: email,
      from: 'myselect-company',
      subject: 'First verification',
      html: `<p>For first verification, click this link <a href="http://localhost:3000/verification/first/${link}">http://localhost:3000/verification/first/${link}</a></p>`,
    });
  }

  async sendSecondLetter(email: string, id: string) {
    this.mailerService.sendMail({
      to: email,
      from: 'myselect-company',
      subject: 'Second verification',
      html: `<p>For the second and final verification, click this link <a href="http://localhost:3000/verification/second/${id}">http://localhost:3000/verification/second/${id}</a></p>`,
    });
  }

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('create_user');
    this.authClient.subscribeToResponseOf('update_user');
    this.authClient.subscribeToResponseOf('get_current_user');
    this.authClient.subscribeToResponseOf('get_nickname');
    this.authClient.subscribeToResponseOf('get_user_info');
    this.authClient.subscribeToResponseOf('follow_to_user');
    this.authClient.subscribeToResponseOf('get_current_followers');
    this.authClient.subscribeToResponseOf('get_full_followings');
    this.authClient.subscribeToResponseOf('create_moderator_request');
    this.authClient.subscribeToResponseOf('show_moderator_request_id');
    this.authClient.subscribeToResponseOf('user_cancel_moderator');
    this.authClient.subscribeToResponseOf('show_waiting_requests');
    this.authClient.subscribeToResponseOf('decide_request');
    this.authClient.subscribeToResponseOf('create_report');
    this.authClient.subscribeToResponseOf('show_reports');
    this.authClient.subscribeToResponseOf('ban_user');
    this.authClient.subscribeToResponseOf('first_verify_user');
    this.authClient.subscribeToResponseOf('second_verify_user');
    this.authClient.subscribeToResponseOf('get_followers_statistics');
    await this.authClient.connect();
  }
}
