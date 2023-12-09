import { Module } from '@nestjs/common';

import { KafkaModule } from '../kafka';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [KafkaModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
