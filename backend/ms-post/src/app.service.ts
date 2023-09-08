import { Injectable } from '@nestjs/common';
import { PostCreatedEvent } from './events/post-created.event';
import { PrismaService } from './prisma/prisma.service';

export enum ReactionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async createPost(dto) {
    //
  }

  async updatePost(userId: string, dto) {
    //
  }

  async deletePost(userId: string, postId: string) {
    const user = await this.prisma.shortUser.findUnique({
      where: {
        userId,
      },
    });
    const isModerator: boolean =
      user.role == 'ADMIN' || user.role == 'MODERATOR';
    const newPost = await this.prisma.post.update({
      where: {
        id: postId,
        ...(!isModerator ? { userId: userId } : {}),
      },
      data: {
        visible: false,
      },
    });
    return newPost;
  }

  async getPost(id: string, viewerId?: string) {
    //
  }

  async getPostList(viewerId?: string) {
    //
  }

  async getPostListOfUser(userId: string, viewerId?: string) {
    //
  }

  async reactOnPost(postId: string, userId: string, reaction: ReactionType) {
    //
  }

  async vote(variant: string, userId: string) {
    //
  }

  async addVariant(postId: string, userId: string) {
    //
  }

  async getReactionInfo(postId: string) {
    //
  }

  async getPollInfo(postId: string) {
    //
  }

  async getPostOfFollowings(userId: string) {
    //
  }

  async getTrendingPosts() {
    //
  }

  // For search field
  async searchPosts() {
    //
  }

  async handlePostCreated(postCreatedEvent: PostCreatedEvent) {
    console.log(postCreatedEvent);
    console.log(postCreatedEvent.createPostDto);
    console.log(postCreatedEvent.postId);
    return { answer: postCreatedEvent, secondAnswer: 902 };
  }
}
