import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { KafkaClient } from './tokens';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KafkaClient.UserService,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.getOrThrow('KAFKA_USER_CLIENT_ID'),
              brokers: [configService.getOrThrow('KAFKA_URL')],
            },
            consumer: {
              groupId: configService.getOrThrow('KAFKA_USER_GROUP_ID'),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: KafkaClient.PostService,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.getOrThrow('KAFKA_POST_CLIENT_ID'),
              brokers: [configService.getOrThrow('KAFKA_URL')],
            },
            consumer: {
              groupId: configService.getOrThrow('KAFKA_POST_GROUP_ID'),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: KafkaClient.CommentService,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.getOrThrow('KAFKA_COMMENT_CLIENT_ID'),
              brokers: [configService.getOrThrow('KAFKA_URL')],
            },
            consumer: {
              groupId: configService.getOrThrow('KAFKA_COMMENT_GROUP_ID'),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
