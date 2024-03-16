import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from 'nestjs-prisma';

import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './auth/common/guards';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.getOrThrow('DATABASE_URL');

        return {
          prismaOptions: {
            datasources: {
              db: {
                url,
              },
            },
          },
          explicitConnect: true,
        };
      },
    }),
    AuthModule,
    CommentModule,
    PostModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
