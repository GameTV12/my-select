import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserDto } from '../dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { UserCreatedEvent } from '../events/user-created.event';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('USER_SERVICE') private readonly authClient: ClientKafka,
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async signupLocal(dto: CreateUserDto) {
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
        linkNickname: dto.linkNickname,
        password: hash,
        email: dto.email,
      },
    });

    const tokens = await this.getTokens(
      newUser.userId,
      newUser.email,
      newUser.role,
      newUser.visible,
      newUser.unlockTime,
    );
    await this.updateRtHash(newUser.userId, tokens.refresh_token);
    return tokens;
  }
  // signinLocal() {}
  // logout() {}
  //
  // refreshTokens() {}
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

  async getTokens(
    userId: string,
    email: string,
    role: string,
    visible: boolean,
    unlockTime: any,
  ) {
    const payload = {
      id: userId,
      email: email,
      role: role,
      visible: visible,
      unlockTime: unlockTime || -1,
    };
    const secret = this.config.get('JWT_SECRET');

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: 45,
        secret: 'at-' + secret,
      }),
      this.jwt.signAsync(payload, {
        expiresIn: 3600 * 24 * 90,
        secret: 'rt-' + secret,
      }),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('create_user');
    await this.authClient.connect();
  }
}
