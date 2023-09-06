import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { EditCommentDto } from '../dtos/edit-comment.dto';
import { CreateCommentDto } from '../dtos/create-comment.dto';

export enum ReactionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

export enum Type {
  POST = 'POST',
  VARIANT = 'VARIANT',
}

@Injectable()
export class CommentService implements OnModuleInit {
  constructor(
    @Inject('COMMENT_SERVICE') private readonly commentClient: ClientKafka,
    private prisma: PrismaService,
  ) {}

  async createComment(userId: string, type: Type, dto: CreateCommentDto) {
    const newCommentDto = {
      userId: userId,
      type: type,
      text: dto.text,
      goalId: dto.goalId,
      replyTo: dto.replyTo,
    };
    const comment = await new Promise((resolve) => {
      this.commentClient
        .send('create_comment', newCommentDto)
        .subscribe((data) => {
          resolve(data);
        });
    });
    return comment;
  }

  async getCommentList(goalId: string, type: Type, viewerId?: string | null) {
    const comments = await new Promise((resolve) => {
      this.commentClient
        .send('get_comments', { goalId, type, viewerId })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return comments;
  }

  async getAllCommentsOfUser(userId: string, viewerId?: string | null) {
    const comments = await new Promise((resolve) => {
      this.commentClient
        .send('get_all_comments_of_user', { userId, viewerId })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return comments;
  }

  async updateComment(userId: string, dto: EditCommentDto) {
    const comment = await new Promise((resolve) => {
      this.commentClient
        .send('update_comment', { userId, dto })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return comment;
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await new Promise((resolve) => {
      this.commentClient
        .send('delete_comment', { userId, commentId })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return comment;
  }

  async reactOnComment(commentId: string, userId: string, type: ReactionType) {
    const reaction = await new Promise((resolve) => {
      this.commentClient
        .send('react_on_comment', { commentId, userId, type })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return reaction;
  }

  async onModuleInit() {
    this.commentClient.subscribeToResponseOf('create_comment');
    this.commentClient.subscribeToResponseOf('get_comments');
    this.commentClient.subscribeToResponseOf('get_all_comments_of_user');
    this.commentClient.subscribeToResponseOf('update_comment');
    this.commentClient.subscribeToResponseOf('delete_comment');
    this.commentClient.subscribeToResponseOf('react_on_comment');
    await this.commentClient.connect();
  }
}
