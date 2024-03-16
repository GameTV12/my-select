import { Module } from '@nestjs/common';
import { KafkaModule } from '../kafka';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [KafkaModule],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
