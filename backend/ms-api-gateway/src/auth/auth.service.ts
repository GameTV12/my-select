import {
  BadGatewayException,
  ForbiddenException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { EditUserDto, LogInDto, CreateUserDto } from '../dtos';

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

    const tokens = await this.getTokens(
      newUser.userId,
      newUser.email,
      newUser.role,
      newUser.visible,
      newUser.firstVerification,
      newUser.secondVerification,
      newUser.unlockTime,
    );
    await this.updateRtHash(newUser.userId, tokens.refresh_token);
    return tokens;
  }
  async signinLocal(dto: LogInDto): Promise<Tokens> {
    const user = await this.prisma.authUser.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(
      user.userId,
      user.email,
      user.role,
      user.visible,
      user.firstVerification,
      user.secondVerification,
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
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');
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
      newUser.unlockTime,
    );
    await this.updateRtHash(newUser.userId, tokens.refresh_token);
    return tokens;
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.authUser.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access denied');
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
    unlockTime: any,
  ) {
    const payload = {
      id: userId,
      email: email,
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
    await this.authClient.connect();
  }
}
