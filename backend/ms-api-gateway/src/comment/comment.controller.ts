import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommentService, ReactionType, Type } from './comment.service';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { GetCurrentUserId, Public } from '../auth/common/decorators';
import { EditCommentDto } from '../dtos/edit-comment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('post')
  @HttpCode(HttpStatus.CREATED)
  createPostComment(
    @Body() dto: CreateCommentDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.commentService.createComment(userId, Type.POST, dto);
  }

  @Post('variant')
  @HttpCode(HttpStatus.CREATED)
  createVariantComment(
    @Body() dto: CreateCommentDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.commentService.createComment(userId, Type.VARIANT, dto);
  }

  @Get('post/:id')
  @Public()
  getPostComments(@Param('id') goalId: string) {
    return this.commentService.getCommentList(goalId, Type.POST);
  }

  @Get('post/auth/:id')
  getPostCommentsAuth(
    @GetCurrentUserId() userId: string,
    @Param('id') goalId: string,
  ) {
    return this.commentService.getCommentList(goalId, Type.POST, userId);
  }

  @Get('variant/:id')
  @Public()
  getVariantComments(@Param('id') goalId: string) {
    return this.commentService.getCommentList(goalId, Type.VARIANT);
  }

  @Get('variant/auth/:id')
  getVariantCommentsAuth(
    @GetCurrentUserId() userId: string,
    @Param('id') goalId: string,
  ) {
    return this.commentService.getCommentList(goalId, Type.VARIANT, userId);
  }

  @Get('user/:id')
  @Public()
  getUserComments(@Param('id') linkNickname: string) {
    return this.commentService.getAllCommentsOfUser(linkNickname, null);
  }

  @Get('user/auth/:id')
  getUserCommentsAuth(
    @GetCurrentUserId() userId: string,
    @Param('id') linkNickname: string,
  ) {
    return this.commentService.getAllCommentsOfUser(linkNickname, userId);
  }

  @Patch('update')
  updateComment(
    @GetCurrentUserId() userId: string,
    @Body() dto: EditCommentDto,
  ) {
    return this.commentService.updateComment(userId, dto);
  }

  @Delete(':id')
  deleteComment(
    @GetCurrentUserId() userId: string,
    @Param('id') commentId: string,
  ) {
    return this.commentService.deleteComment(userId, commentId);
  }

  @Patch('/:id/like')
  likeComment(
    @GetCurrentUserId() userId: string,
    @Param('id') commentId: string,
  ) {
    return this.commentService.reactOnComment(
      commentId,
      userId,
      ReactionType.LIKE,
    );
  }

  @Patch('/:id/dislike')
  dislikeComment(
    @GetCurrentUserId() userId: string,
    @Param('id') commentId: string,
  ) {
    return this.commentService.reactOnComment(
      commentId,
      userId,
      ReactionType.DISLIKE,
    );
  }
}
