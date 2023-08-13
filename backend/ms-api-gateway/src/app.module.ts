import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/common/guards';
import { UserModule } from './user/user.module';
import { CommentController } from './comment/comment.controller';
import { CommentService } from './comment/comment.service';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostModule,
    AuthModule,
    PrismaModule,
    UserModule,
    CommentModule,
  ],
  controllers: [CommentController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    CommentService,
  ],
})
export class AppModule {}
