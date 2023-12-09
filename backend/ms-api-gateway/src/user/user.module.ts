import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import process from 'process';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user',
            brokers: [`${process.env['KAFKA_URL']}:9092`],
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
            brokers: [`${process.env['KAFKA_URL']}:9092`],
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
            brokers: [`${process.env['KAFKA_URL']}:9092`],
          },
          consumer: {
            groupId: 'post-consumer',
          },
        },
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
