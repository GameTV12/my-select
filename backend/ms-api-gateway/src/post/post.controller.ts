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
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, EditPostDto } from '../dtos';
import { GetCurrentUserId, Public } from '../auth/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { ReactionType } from '../comment/comment.service';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Public()
  @Get('trends')
  getTrendingPosts() {
    return this.postService.getTrendingPosts();
  }

  @Get('followings')
  getPostOfFollowings(@GetCurrentUserId() viewerId: string) {
    return this.postService.getPostOfFollowings(viewerId);
  }

  @Public()
  @Get('short/:id')
  getShortPostInfoById(@Param('id') postId: string) {
    return this.postService.getShortPostInfoById(postId);
  }

  @Public()
  @Get(':id')
  getPostById(@Param('id') postId: string) {
    return this.postService.getPostById(postId);
  }

  @Get(':id/auth')
  getPostByIdAuth(
    @Param('id') postId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.postService.getPostById(postId, userId);
  }

  @Post()
  createPost(
    @Body(ValidationPipe) createPostDto: CreatePostDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.postService.createPost(userId, createPostDto);
  }

  @Patch(':id')
  updatePost(
    @Param('id') postId: string,
    @Body() dto: EditPostDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.postService.updatePost(userId, postId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePost(@Param('id') postId: string, @GetCurrentUserId() userId) {
    return this.postService.deletePost(userId, postId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/variants/:id')
  deleteVariant(@Param('id') variantId: string) {
    return this.postService.deleteVariant(variantId);
  }

  @Get(':link/user/auth')
  getPostListOfUserAuth(
    @Param('link') link: string,
    @GetCurrentUserId() viewerId: string,
  ) {
    return this.postService.getPostListOfUser(link, viewerId);
  }

  @Public()
  @Get(':link/user')
  getPostListOfUser(@Param('link') link: string) {
    return this.postService.getPostListOfUser(link);
  }

  @Patch('/:id/like')
  likePost(@Param('id') postId: string, @GetCurrentUserId() userId: string) {
    return this.postService.reactOnPost(postId, userId, ReactionType.LIKE);
  }

  @Patch('/:id/dislike')
  dislikePost(@Param('id') postId: string, @GetCurrentUserId() userId: string) {
    return this.postService.reactOnPost(postId, userId, ReactionType.DISLIKE);
  }

  @Public()
  @Get('/:id/info/likes')
  getLikeInfo(@Param('id') postId: string) {
    return this.postService.getReactionInfo(postId, ReactionType.LIKE);
  }

  @Public()
  @Get('/:id/info/dislikes')
  getDislikeInfo(@Param('id') postId: string) {
    return this.postService.getReactionInfo(postId, ReactionType.DISLIKE);
  }

  @Public()
  @Get('/:id/info/poll')
  getPollInfo(@Param('id') postId: string) {
    return this.postService.getPollInfo(postId);
  }

  @Patch('/variant/:id/vote')
  voteForPost(
    @Param('id') variant: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.postService.voteForPost(variant, userId);
  }

  @Post('/:id/variant')
  addVariant(
    @Param('id') postId: string,
    @GetCurrentUserId() userId: string,
    @Body() dto: { variant: string },
  ) {
    return this.postService.addVariant(dto.variant, userId, postId);
  }

  @Get('auth/trends')
  getTrendingPostsAuth(@GetCurrentUserId() viewerId: string) {
    return this.postService.getTrendingPosts(viewerId);
  }

  @Get('auth/search/:args')
  searchPostsAuth(
    @Param('args') args: string,
    @GetCurrentUserId() viewerId: string,
  ) {
    return this.postService.searchPosts(args, viewerId);
  }

  @Public()
  @Get('search/:args')
  searchPosts(@Param('args') args: string) {
    return this.postService.searchPosts(args);
  }
}
