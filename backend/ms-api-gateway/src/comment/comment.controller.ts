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
  getPostCommentsUnauthorized(@Param('id') goalId: string) {
    return this.commentService.getCommentList(goalId, Type.POST, null);
  }

  @Get('post/:id')
  getPostComments(
    @GetCurrentUserId() userId: string,
    @Param('id') goalId: string,
  ) {
    return this.commentService.getCommentList(goalId, Type.POST, userId);
  }

  @Get('variant/:id')
  @Public()
  getVariantCommentsUnauthorized(@Param('id') goalId: string) {
    console.log(1);
    return this.commentService.getCommentList(goalId, Type.VARIANT, null);
  }

  @Get('variant/:id')
  getVariantComments(
    @GetCurrentUserId() userId: string,
    @Param('id') goalId: string,
  ) {
    return this.commentService.getCommentList(goalId, Type.VARIANT, userId);
  }

  @Get('user/:id')
  @Public()
  getUserCommentsUnauthorized(@Param('id') goalId: string) {
    return this.commentService.getAllCommentsOfUser(goalId, null);
  }

  @Get('user/:id')
  getUserComments(
    @GetCurrentUserId() userId: string,
    @Param('id') goalId: string,
  ) {
    return this.commentService.getAllCommentsOfUser(goalId, userId);
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
