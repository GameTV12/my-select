import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateCommentDto, EditCommentDto } from './dtos';
import { CommentInterface } from './types/CommentInterface';
import e from 'express';

export enum Type {
  POST = 'POST',
  VARIANT = 'VARIANT',
}

export enum ReactionType {
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

  async getCommentList(goalId: string, type: Type, viewerId?: string) {
    const commentWithLikes: CommentInterface[] =
      await this.prisma.comment.findMany({
        where: {
          type: type,
          goalId: goalId,
          visible: true,
          user: {
            visible: true,
          },
        },
        select: {
          id: true,
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
    const commentWithDislikes: CommentInterface[] =
      await this.prisma.comment.findMany({
        where: {
          type: type,
          goalId: goalId,
          visible: true,
          user: {
            visible: true,
          },
        },
        select: {
          id: true,
          text: true,
          _count: {
            select: {
              Reaction: {
                where: {
                  endTime: null,
                  type: ReactionType.DISLIKE,
                },
              },
            },
          },
        },
      });
    if (!viewerId) {
      return commentWithLikes.map((item) => {
        const dislikes = commentWithDislikes.find((x) => x.id == item.id);
        return {
          ...item,
          likes: item._count.Reaction,
          dislikes: dislikes._count.Reaction,
        };
      });
    }

    const allReactions = await this.prisma.reaction.findMany({
      where: {
        AND: { userId: viewerId, endTime: null },
      },
    });
    return commentWithLikes.map((item) => {
      const dislikes = commentWithDislikes.find((x) => x.id == item.id);
      const reaction = allReactions.find((x) => x.commentId == item.id);
      return {
        ...item,
        status: reaction.type,
        likes: item._count.Reaction,
        dislikes: dislikes._count.Reaction,
      };
    });
  }

  async getAllCommentsOfUser(userId: string, viewerId?: string | null) {
    const commentWithLikes: CommentInterface[] =
      await this.prisma.comment.findMany({
        where: {
          visible: true,
          userId: userId,
        },
        select: {
          id: true,
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
    const commentWithDislikes: CommentInterface[] =
      await this.prisma.comment.findMany({
        where: {
          visible: true,
          userId: userId,
        },
        select: {
          id: true,
          text: true,
          _count: {
            select: {
              Reaction: {
                where: {
                  endTime: null,
                  type: ReactionType.DISLIKE,
                },
              },
            },
          },
        },
      });
    if (!viewerId) {
      return commentWithLikes.map((item) => {
        const dislikes = commentWithDislikes.find((x) => x.id == item.id);
        return {
          ...item,
          likes: item._count.Reaction,
          dislikes: dislikes._count.Reaction,
        };
      });
    }

    const allReactions = await this.prisma.reaction.findMany({
      where: {
        AND: { userId: viewerId, endTime: null },
      },
    });
    return commentWithLikes.map((item) => {
      const dislikes = commentWithDislikes.find((x) => x.id == item.id);
      const reaction = allReactions.find((x) => x.commentId == item.id);
      return {
        ...item,
        status: reaction.type,
        likes: item._count.Reaction,
        dislikes: dislikes._count.Reaction,
      };
    });
  }

  async updateComment(userId: string, dto: EditCommentDto) {
    const newComment = await this.prisma.comment.update({
      where: {
        id: dto.id,
        user: {
          id: userId,
        },
      },
      data: {
        text: dto.text,
        replyTo: dto.replyTo,
      },
    });
    return newComment;
  }

  async deleteComment(userId: string, commentId: string) {
    const user = await this.prisma.shortUser.findUnique({
      where: {
        id: userId,
      },
    });
    const isModerator: boolean =
      user.role == 'ADMIN' || user.role == 'MODERATOR';
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
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment) throw new NotFoundException('Comment not found');

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
    if (checkReaction.length == 0 || checkReaction[0].endTime != null) {
      newReaction = await this.prisma.reaction.create({
        data: {
          type: type,
          startTime: new Date(),
          commentId: commentId,
          userId: userId,
        },
      });
    } else {
      newReaction = await this.prisma.reaction.update({
        where: {
          id: checkReaction[0].id,
        },
        data: {
          endTime: new Date(),
        },
      });
      if (checkReaction[0].type != type) {
        newReaction = await this.prisma.reaction.create({
          data: {
            type: type,
            startTime: new Date(),
            commentId: commentId,
            userId: userId,
          },
        });
      }
    }

    return newReaction;
  }
}