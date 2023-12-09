import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import process from 'process';

@Module({
  imports: [
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
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
