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
import { GoogleStrategy } from './strategies/google.strategy';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('USER_SERVICE') private readonly authClient: ClientKafka,
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private googleStrategy: GoogleStrategy,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async signupLocal(dto: CreateUserDto): Promise<Tokens> {
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
        photo: dto.photo,
        linkNickname: dto.linkNickname,
        password: hash,
        email: dto.email,
      },
    });

    const postCommentUser = {
      userId: realUserId,
      nickname: dto.nickname,
      photo: dto.photo,
      linkNickname: dto.linkNickname,
    };

    await new Promise((resolve) => {
      this.authClient
        .send('post_create_user', postCommentUser)
        .subscribe((data) => {
          resolve(data);
        });
    });

    await new Promise((resolve) => {
      this.authClient
        .send('comment_create_user', postCommentUser)
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
    return tokens;
  }

  async googleLogin(req) {
    console.log(req.session);
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
    return !!user;
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

    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

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
    console.log(dto);
    const user = await this.prisma.authUser.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!user) throw new ForbiddenException('Access Denied');
    let hash;
    if (dto.password) {
      hash = await this.hashData(dto.password);
    } else {
      hash = user.password;
    }
    const newUser = await this.prisma.authUser.update({
      where: {
        userId: userId,
      },
      data: {
        userId: userId,
        nickname: dto.nickname,
        photo: dto.photo,
        linkNickname: dto.linkNickname,
        password: hash,
        email: dto.email,
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
        expiresIn: 45 * 3600,
        secret: 'at-' + secret,
      }),
      this.jwt.signAsync(payload, {
        expiresIn: 90 * 3600 * 24,
        secret: 'rt-' + secret,
      }),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('create_user');
    this.authClient.subscribeToResponseOf('update_user');
    this.authClient.subscribeToResponseOf('get_current_user');
    this.authClient.subscribeToResponseOf('get_nickname');
    this.authClient.subscribeToResponseOf('follow_to_user');
    this.authClient.subscribeToResponseOf('get_current_followers');
    this.authClient.subscribeToResponseOf('get_full_followings');
    this.authClient.subscribeToResponseOf('create_moderator_request');
    this.authClient.subscribeToResponseOf('show_moderator_request_id');
    this.authClient.subscribeToResponseOf('show_waiting_requests');
    this.authClient.subscribeToResponseOf('decide_request');
    this.authClient.subscribeToResponseOf('create_report');
    this.authClient.subscribeToResponseOf('show_reports');
    this.authClient.subscribeToResponseOf('ban_user');
    await this.authClient.connect();
  }
}
