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
import { CreatePostDto } from '../dtos';
import { GetCurrentUserId, Public } from '../auth/common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Public()
  @Get(':id')
  getPostById(@Param('id') postId: string) {
    return this.postService.getPostById(postId);
  }

  @Post()
  createPost(
    @Body(ValidationPipe) createPostDto: CreatePostDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.postService.createPost(userId, createPostDto);
  }

  @Patch(':id')
  editPost(@Param('id') postId: string, @Body() dto: CreatePostDto) {
    return this.postService.editPost('mockUserId', postId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePost(@Param('id') postId: string) {
    return this.postService.deletePost('userId', postId);
  }
}
