import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreatePostDto } from '../dtos';

@Injectable()
export class PostService implements OnModuleInit {
  constructor(
    @Inject('POST_SERVICE') private readonly postClient: ClientKafka,
  ) {}

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
    this.postClient.subscribeToResponseOf('post_created');
    await this.postClient.connect();
  }
}
