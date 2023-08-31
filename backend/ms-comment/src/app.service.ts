import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateCommentDto, EditCommentDto } from './dtos';

enum Type {
  POST = 'POST',
  VARIANT = 'VARIANT',
}

enum ReactionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}
@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async createComment(dto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: {
        userId: dto.userId,
        text: dto.text,
        goalId: dto.goalId,
        type: dto.type,
        replyTo: dto.replyTo,
      },
    });
    return comment;
  }

  // I'll finish this, it's a huge
  async getCommentList(goalId: string, type: Type) {
    const comment = await this.prisma.comment.findMany({
      where: {
        type: type,
        goalId: goalId,
        visible: true,
        user: {
          visible: true,
        },
      },
      select: {
        text: true,
        reply: {
          select: {
            id: true,
            text: true,
          },
        },
        user: {
          select: {
            id: true,
            nickname: true,
            linkNickname: true,
            photo: true,
            role: true,
            secondVerification: true,
          },
        },
        _count: {
          select: {
            Reaction: {
              where: {
                endTime: null,
                type: ReactionType.LIKE,
              },
            },
          },
        },
      },
    });
    return comment;
  }

  async getAllCommentsOfUser(userId: string) {
    const comment = await this.prisma.comment.findMany({
      where: {
        userId: userId,
        visible: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return comment;
  }

  async updateComment(dto: EditCommentDto) {
    const newComment = await this.prisma.comment.update({
      where: {
        id: dto.id,
      },
      data: {
        text: dto.text,
        replyTo: dto.replyTo,
      },
    });
    return newComment;
  }

  async deleteComment(userId: string, commentId: string, isModerator: boolean) {
    const newComment = await this.prisma.comment.update({
      where: {
        id: commentId,
        ...(!isModerator ? { userId: userId } : {}),
      },
      data: {
        visible: false,
      },
    });
    return newComment;
  }

  async reactOnComment(commentId: string, userId: string, type: ReactionType) {
    const checkReaction = await this.prisma.reaction.findMany({
      where: {
        AND: { commentId: commentId, userId: userId },
      },
      orderBy: {
        startTime: 'desc',
      },
      take: 1,
    });

    let newReaction;
    // if (checkReaction.length > 0 && checkReaction[0].endTime == null) {
    //   newReaction = await this.prisma.reaction.update({
    //     where: {
    //
    //     },
    //     data: {
    //       end: new Date(),
    //     },
    //   });
    // } else {
    //   newReaction = await this.prisma.followers.create({
    //     data: {
    //       follower: from,
    //       following: to,
    //       start: new Date(),
    //     },
    //   });
    // }
    //
    // return newReaction;
  }
}
