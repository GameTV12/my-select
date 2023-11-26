import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreatePostDto } from '../dtos';

@Injectable()
export class PostService implements OnModuleInit {
  constructor(
    @Inject('POST_SERVICE') private readonly postClient: ClientKafka,
  ) {}

  async createPost(userId: string, dto: CreatePostDto) {
    const newPostDto = {
      ...dto,
      userId,
    };
    const post = await new Promise((resolve) => {
      this.postClient.send('create_post', newPostDto).subscribe((data) => {
        resolve(data);
      });
    });
    return post;
  }

  async getPostById(postId: string) {
    return { id: postId };
  }

  async editPost(userId: string, postId: string, dto: CreatePostDto) {
    return 1;
  }

  async deletePost(userId: string, postId: string) {
    return 1;
  }

  async onModuleInit() {
    this.postClient.subscribeToResponseOf('create_post');
    this.postClient.subscribeToResponseOf('post_create_user');
    this.postClient.subscribeToResponseOf('post_update_user');
    this.postClient.subscribeToResponseOf('post_ban_user');
    this.postClient.subscribeToResponseOf('post_make_moderator');
    this.postClient.subscribeToResponseOf('post_cancel_moderator');
    await this.postClient.connect();
  }
}
