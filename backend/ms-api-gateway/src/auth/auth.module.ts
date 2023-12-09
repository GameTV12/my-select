import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategies';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import * as process from 'process';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user',
            brokers: [`kafka:9092`],
          },
          consumer: {
            groupId: 'user-consumer',
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'COMMENT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'comment',
            brokers: [`kafka:9092`],
          },
          consumer: {
            groupId: 'comment-consumer',
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'POST_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'post',
            brokers: [`kafka:9092`],
          },
          consumer: {
            groupId: 'post-consumer',
          },
        },
      },
    ]),
    JwtModule.register({
      global: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'gametvcity.com@gmail.com',
          pass: 'nehn gluy pagj gbdg',
        },
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AtStrategy,
    RtStrategy,
    GoogleStrategy,
    FacebookStrategy,
  ],
})
export class AuthModule {}
