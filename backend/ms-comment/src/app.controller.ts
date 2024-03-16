import { Controller, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService, ReactionType, Type } from './app.service';
import { CreateCommentDto, EditCommentDto } from './dtos';

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

  @MessagePattern('get_number_comments_of_user')
  getNumberCommentsOfUser(
    @Payload(ValidationPipe)
    data: string,
  ) {
    return this.appService.getNumberCommentsOfUser(data);
  }

  @MessagePattern('get_all_comments_of_user')
  getAllCommentsOfUser(
    @Payload(ValidationPipe)
    data: {
      linkNickname: string;
      viewerId?: string | null;
    },
  ) {
    return this.appService.getAllCommentsOfUser(
      data.linkNickname,
      data.viewerId,
    );
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

  @MessagePattern('comment_create_user')
  createUser(@Payload(ValidationPipe) dto) {
    return this.appService.createUser(dto);
  }

  @MessagePattern('comment_update_user')
  updateUser(@Payload(ValidationPipe) dto) {
    return this.appService.updateUser(dto);
  }

  @MessagePattern('comment_ban_user')
  banUser(@Payload(ValidationPipe) data) {
    return this.appService.banUser(data);
  }

  @MessagePattern('comment_make_moderator')
  makeModerator(@Payload(ValidationPipe) data) {
    return this.appService.makeModerator(data);
  }

  @MessagePattern('comment_cancel_moderator')
  cancelModerator(@Payload(ValidationPipe) data) {
    return this.appService.cancelModerator(data);
  }

  @MessagePattern('comment_verify_user')
  postVerifyUser(@Payload(ValidationPipe) dto) {
    return this.appService.commentVerifyUser(dto.id);
  }
}
