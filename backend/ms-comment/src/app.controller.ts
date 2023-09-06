import { Controller, ValidationPipe } from '@nestjs/common';
import { AppService, Type } from './app.service';
import { CreateCommentDto, EditCommentDto } from './dtos';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReactionType } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create_comment')
  createComment(@Payload(ValidationPipe) dto: CreateCommentDto) {
    return this.appService.createComment(dto);
  }

  @MessagePattern('get_comments')
  getCommentList(
    @Payload(ValidationPipe)
    data: {
      goalId: string;
      type: Type;
      viewerId?: string;
    },
  ) {
    return this.appService.getCommentList(
      data.goalId,
      data.type,
      data.viewerId,
    );
  }

  @MessagePattern('get_all_comments_of_user')
  getAllCommentsOfUser(
    @Payload(ValidationPipe)
    data: {
      userId: string;
      viewerId?: string | null;
    },
  ) {
    return this.appService.getAllCommentsOfUser(data.userId, data.viewerId);
  }

  @MessagePattern('update_comment')
  updateComment(
    @Payload(ValidationPipe) data: { userId: string; dto: EditCommentDto },
  ) {
    return this.appService.updateComment(data.userId, data.dto);
  }

  @MessagePattern('delete_comment')
  deleteComment(
    @Payload(ValidationPipe)
    data: {
      userId: string;
      commentId: string;
    },
  ) {
    return this.appService.deleteComment(data.userId, data.commentId);
  }

  @MessagePattern('react_on_comment')
  reactOnComment(
    @Payload(ValidationPipe)
    data: {
      commentId: string;
      userId: string;
      type: ReactionType;
    },
  ) {
    return this.appService.reactOnComment(
      data.commentId,
      data.userId,
      data.type,
    );
  }
}
