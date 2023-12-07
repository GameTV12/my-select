import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PostDto } from './dtos/post.dto';
import { PostInterface } from './types/PostInterface';

export type Statistics = {
  time: number;
  parameter: number;
  realParameter: number;
};

export enum ReactionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async createPost(dto: PostDto) {
    const newPost = await this.prisma.post.create({
      data: {
        shortUserUserId: dto.userId,
        title: dto.title,
        text: dto.text,
        commentsAllowed: dto.commentsAllowed,
        variantsAllowed: dto.variantsAllowed,
        video: dto.video,
      },
    });
    const postId: string = newPost.id;
    if (dto.photos) {
      const newPhotos = await this.prisma.photo.createMany({
        data: dto.photos.map((item) => {
          return { link: item, postId: postId };
        }),
      });
    }
    if (dto.variants) {
      const newVariants = await this.prisma.variant.createMany({
        data: dto.variants.map((item) => ({
          text: item,
          votes: 0,
          postId: postId,
        })),
      });
    }
    const returnPost = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    return returnPost;
  }

  async updatePost(userId: string, postId: string, dto: PostDto) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) throw new NotFoundException('Post not found');

    await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title: dto.title,
        text: dto.text,
      },
    });

    const postInfo: PostInterface = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        title: true,
        text: true,
        video: true,
        variantsAllowed: true,
        commentsAllowed: true,
        Variants: true,
        Photo: true,
        createdAt: true,
        user: {
          select: {
            userId: true,
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

    const dislikes = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
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

    const userReaction = await this.prisma.reaction.findMany({
      where: {
        AND: [{ userId }, { endTime: null }, { postId }],
      },
    });
    const userVoted = await this.prisma.vote.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });
    return {
      ...postInfo,
      likes: postInfo._count.Reaction,
      dislikes: dislikes._count.Reaction,
      status: userReaction.length > 0 ? userReaction[0].type : null,
      isVoted: userVoted != undefined,
    };
  }

  async deletePost(userId: string, postId: string) {
    const user = await this.prisma.shortUser.findUnique({
      where: {
        userId,
      },
    });
    const authorOfPost = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        user: true,
      },
    });
    if (authorOfPost == null) {
      throw new Error();
    }
    if (
      authorOfPost.user.userId == userId ||
      (user.role == 'ADMIN' && authorOfPost.user.role != 'ADMIN') ||
      (user.role == 'MODERATOR' && authorOfPost.user.role == 'DEFAULT_USER')
    ) {
      const newPost = await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          visible: false,
        },
      });

      return newPost;
    }
    return authorOfPost;
  }

  async getPost(id: string, viewerId?: string) {
    const postInfo: PostInterface = await this.prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        text: true,
        video: true,
        variantsAllowed: true,
        commentsAllowed: true,
        Variants: true,
        Photo: true,
        createdAt: true,
        user: {
          select: {
            userId: true,
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
    if (!postInfo) return null;
    const dislikes = await this.prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        _count: {
          select: {
            Reaction: {
              where: {
                AND: [{ endTime: null }, { type: ReactionType.DISLIKE }],
              },
            },
          },
        },
      },
    });
    if (!viewerId) {
      return {
        ...postInfo,
        likes: postInfo._count.Reaction,
        dislikes: dislikes._count.Reaction,
      };
    }

    const userReaction = await this.prisma.reaction.findMany({
      where: {
        AND: [
          {
            userId: viewerId,
          },
          { endTime: null },
          { postId: id },
        ],
      },
    });
    const userVoted = await this.prisma.vote.findUnique({
      where: {
        userId_postId: { userId: viewerId, postId: id },
      },
    });
    return {
      ...postInfo,
      likes: postInfo._count.Reaction,
      dislikes: dislikes._count.Reaction,
      status: userReaction.length > 0 ? userReaction[0].type : null,
      isVoted: userVoted != undefined,
    };
  }

  async getShortPost(postId: string) {
    const postInfo = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        title: true,
        text: true,
      },
    });
    return postInfo;
  }

  async deleteVariant(variantId: string) {
    const variant = await this.prisma.variant.delete({
      where: {
        id: variantId,
      },
    });
  }

  async getNumberPostsOfUser(linkNickname: string) {
    const numberOfPosts: number = await this.prisma.post.count({
      where: {
        AND: [
          {
            visible: true,
          },
          {
            user: {
              linkNickname: linkNickname,
            },
          },
        ],
      },
    });
    return numberOfPosts;
  }

  async getPostListOfUser(linkNickname: string, viewerId?: string) {
    const postList: PostInterface[] = await this.prisma.post.findMany({
      where: {
        AND: [
          {
            user: {
              linkNickname: linkNickname,
            },
          },
          { visible: true },
        ],
      },
      select: {
        id: true,
        title: true,
        text: true,
        video: true,
        variantsAllowed: true,
        commentsAllowed: true,
        Variants: true,
        Photo: true,
        createdAt: true,
        user: {
          select: {
            userId: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });
    const postsWithDislikes = await this.prisma.post.findMany({
      where: {
        AND: [
          {
            user: {
              linkNickname,
            },
          },
          { visible: true },
        ],
      },
      select: {
        id: true,
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
      return postList.map((item) => {
        const dislikes = postsWithDislikes.find((x) => x.id == item.id);
        return {
          ...item,
          likes: item._count.Reaction,
          dislikes: dislikes._count.Reaction,
        };
      });
    }

    const allReactions = await this.prisma.reaction.findMany({
      where: {
        AND: [{ userId: viewerId }, { endTime: null }],
      },
    });
    const allVotes = await this.prisma.vote.findMany({
      where: {
        AND: { userId: viewerId },
      },
      select: {
        postId: true,
      },
    });

    return postList.map((item) => {
      const dislikes = postsWithDislikes.find((x) => x.id == item.id);
      const reaction = allReactions.find((x) => x.postId == item.id);
      const vote: boolean =
        allVotes.filter((voteItem) => voteItem.postId == item.id).length > 0;

      return {
        ...item,
        status: reaction ? reaction.type : 'NONE',
        likes: item._count.Reaction,
        dislikes: dislikes._count.Reaction,
        isVoted: vote,
      };
    });
  }

  async reactOnPost(postId: string, userId: string, reaction: ReactionType) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) throw new NotFoundException('Post not found');

    const checkReaction = await this.prisma.reaction.findMany({
      where: {
        AND: [{ postId }, { userId }],
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
          type: reaction,
          startTime: new Date(),
          endTime: null,
          postId,
          userId,
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
      if (checkReaction[0].type != reaction) {
        newReaction = await this.prisma.reaction.create({
          data: {
            type: reaction,
            startTime: new Date(),
            endTime: null,
            postId,
            userId,
          },
        });
      }
    }

    const postInfo: PostInterface = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        title: true,
        text: true,
        video: true,
        variantsAllowed: true,
        commentsAllowed: true,
        Variants: true,
        Photo: true,
        createdAt: true,
        user: {
          select: {
            userId: true,
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
    const dislikes = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
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

    const userVoted = await this.prisma.vote.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });
    return {
      ...postInfo,
      likes: postInfo._count.Reaction,
      dislikes: dislikes._count.Reaction,
      status: newReaction.endTime == null ? reaction : null,
      isVoted: userVoted != undefined,
    };
  }

  async vote(variant: string, userId: string) {
    const existingVariant = await this.prisma.variant.findUnique({
      where: {
        id: variant,
      },
    });
    if (!existingVariant) throw new NotFoundException("Variant doesn't exist");
    const existingVote = await this.prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: existingVariant.postId,
        },
      },
    });
    if (existingVote) return;
    await this.prisma.vote.create({
      data: {
        postId: existingVariant.postId,
        userId,
      },
    });
    await this.prisma.variant.update({
      where: {
        id: variant,
      },
      data: {
        votes: existingVariant.votes + 1,
      },
    });
    const newPost = await this.prisma.post.findUnique({
      where: {
        id: existingVariant.postId,
      },
    });
    return newPost;
  }

  async addVariant(postId: string, userId: string, variant: string) {
    const newPost = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!newPost) throw new NotFoundException('Post not found');
    if (!newPost.variantsAllowed)
      throw new ForbiddenException('This post is closed');

    const existingVote = await this.prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    if (existingVote) throw new ForbiddenException('You have already voted');
    await this.prisma.vote.create({
      data: {
        postId,
        userId,
      },
    });
    await this.prisma.variant.create({
      data: {
        votes: 1,
        text: variant,
        postId,
      },
    });

    const postInfo: PostInterface = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        title: true,
        text: true,
        video: true,
        variantsAllowed: true,
        commentsAllowed: true,
        Variants: true,
        Photo: true,
        createdAt: true,
        user: {
          select: {
            userId: true,
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
    const dislikes = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
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

    const userReaction = await this.prisma.reaction.findMany({
      where: {
        AND: [{ userId }, { endTime: null }, { postId }],
      },
    });
    const userVoted = await this.prisma.vote.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });
    return {
      ...postInfo,
      likes: postInfo._count.Reaction,
      dislikes: dislikes._count.Reaction,
      status: userReaction.length > 0 ? userReaction[0].type : null,
      isVoted: userVoted != undefined,
    };
  }

  async getReactionInfo(postId: string, reaction: ReactionType) {
    const searchedPost = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!searchedPost) return null;
    const answer: Statistics[] = [];
    const endDate = new Date().setUTCHours(0, 0, 0, 0);
    const startDate = searchedPost.createdAt.setUTCHours(0, 0, 0, 0);
    const rawReactions = await this.prisma.reaction.findMany({
      where: { postId, type: reaction },
      orderBy: {
        startTime: 'asc',
      },
      select: {
        user: {
          select: {
            secondVerification: true,
          },
        },
        startTime: true,
        endTime: true,
      },
    });
    const reactions = rawReactions.map((item) => ({
      startTime: item.startTime.getTime(),
      endTime: item.endTime ? item.endTime.getTime() : null,
      verification: item.user.secondVerification,
    }));
    for (let i = startDate; i <= endDate; i += 3600 * 24 * 1000) {
      const currentDayData = reactions.filter(
        (item) =>
          item.startTime <= i && (item.endTime == null || item.endTime >= i),
      );
      const overallData = currentDayData.length;
      const verifiedData = currentDayData.filter(
        (item) => item.verification,
      ).length;
      answer.push({
        time: i,
        parameter: overallData,
        realParameter: verifiedData,
      });
    }

    return answer;
  }

  async getPollInfo(postId: string) {
    const searchedPost = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        createdAt: true,
        Variants: true,
      },
    });
    if (!searchedPost) return null;
    if (searchedPost.Variants.length == 0) return [];
    const answer: Statistics[] = [];
    const endDate = new Date().setUTCHours(0, 0, 0, 0);
    const startDate = searchedPost.createdAt.setUTCHours(0, 0, 0, 0);
    const rawReactions = await this.prisma.vote.findMany({
      where: { postId },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        user: {
          select: {
            secondVerification: true,
          },
        },
        createdAt: true,
      },
    });
    const reactions = rawReactions.map((item) => ({
      startTime: item.createdAt.getTime(),
      verification: item.user.secondVerification,
    }));
    for (let i = startDate; i <= endDate; i += 3600 * 24 * 1000) {
      const currentDayData = reactions.filter((item) => item.startTime <= i);
      const overallData = currentDayData.length;
      const verifiedData = currentDayData.filter(
        (item) => item.verification,
      ).length;
      answer.push({
        time: i,
        parameter: overallData,
        realParameter: verifiedData,
      });
    }

    return answer;
  }

  // I must sort this by date up->to
  async getPostOfFollowings(viewerId: string, followings: string[]) {
    const postList: PostInterface[] = await this.prisma.post.findMany({
      where: {
        AND: [{ id: { in: followings } }, { visible: true }],
      },
      select: {
        id: true,
        title: true,
        text: true,
        video: true,
        variantsAllowed: true,
        commentsAllowed: true,
        Variants: true,
        Photo: true,
        createdAt: true,
        user: {
          select: {
            userId: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    const postsWithDislikes = await this.prisma.post.findMany({
      where: {
        id: { in: followings },
        visible: true,
      },
      select: {
        id: true,
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
      return postList.map((item) => {
        const dislikes = postsWithDislikes.find((x) => x.id == item.id);
        return {
          ...item,
          likes: item._count.Reaction,
          dislikes: dislikes._count.Reaction,
        };
      });
    }

    const allReactions = await this.prisma.reaction.findMany({
      where: {
        AND: [{ userId: viewerId }, { endTime: null }],
      },
    });
    const allVotes = await this.prisma.vote.findMany({
      where: {
        AND: { userId: viewerId },
      },
      select: {
        postId: true,
      },
    });

    return postList.map((item) => {
      const dislikes = postsWithDislikes.find((x) => x.id == item.id);
      const reaction = allReactions.find((x) => x.postId == item.id);
      const vote: boolean =
        allVotes.filter((voteItem) => voteItem.postId == item.id).length > 0;

      return {
        ...item,
        status: reaction ? reaction.type : 'NONE',
        likes: item._count.Reaction,
        dislikes: dislikes._count.Reaction,
        isVoted: vote,
      };
    });
  }

  async getTrendingPosts(viewerId?: string) {
    const postList: PostInterface[] = await this.prisma.post.findMany({
      where: {
        visible: true,
      },
      select: {
        id: true,
        title: true,
        text: true,
        video: true,
        variantsAllowed: true,
        commentsAllowed: true,
        Variants: true,
        Photo: true,
        createdAt: true,
        user: {
          select: {
            userId: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });
    const postsWithDislikes = await this.prisma.post.findMany({
      where: {
        visible: true,
      },
      select: {
        id: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!viewerId) {
      return postList.map((item) => {
        const dislikes = postsWithDislikes.find((x) => x.id == item.id);
        return {
          ...item,
          likes: item._count.Reaction,
          dislikes: dislikes._count.Reaction,
        };
      });
    }

    const allReactions = await this.prisma.reaction.findMany({
      where: {
        AND: [{ userId: viewerId }, { endTime: null }],
      },
    });
    const allVotes = await this.prisma.vote.findMany({
      where: {
        AND: { userId: viewerId },
      },
      select: {
        postId: true,
      },
    });

    return postList.map((item) => {
      const dislikes = postsWithDislikes.find((x) => x.id == item.id);
      const reaction = allReactions.find((x) => x.postId == item.id);
      const vote: boolean =
        allVotes.filter((voteItem) => voteItem.postId == item.id).length > 0;

      return {
        ...item,
        status: reaction ? reaction.type : 'NONE',
        likes: item._count.Reaction,
        dislikes: dislikes._count.Reaction,
        isVoted: vote,
      };
    });
  }

  async searchPosts(args: string, viewerId?: string) {
    const postList: PostInterface[] = await this.prisma.post.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                text: {
                  contains: args,
                  mode: 'insensitive',
                },
              },
              {
                title: {
                  contains: args,
                  mode: 'insensitive',
                },
              },
              {
                user: {
                  nickname: {
                    contains: args,
                    mode: 'insensitive',
                  },
                },
              },
              {
                user: {
                  linkNickname: {
                    contains: args,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          },
          { visible: true },
        ],
      },
      select: {
        id: true,
        title: true,
        text: true,
        video: true,
        variantsAllowed: true,
        commentsAllowed: true,
        Variants: true,
        Photo: true,
        createdAt: true,
        user: {
          select: {
            userId: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    const postsWithDislikes = await this.prisma.post.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                text: {
                  contains: args,
                  mode: 'insensitive',
                },
              },
              {
                title: {
                  contains: args,
                  mode: 'insensitive',
                },
              },
              {
                user: {
                  nickname: {
                    contains: args,
                    mode: 'insensitive',
                  },
                },
              },
              {
                user: {
                  linkNickname: {
                    contains: args,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          },
          { visible: true },
        ],
      },
      select: {
        id: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!viewerId) {
      return postList.map((item) => {
        const dislikes = postsWithDislikes.find((x) => x.id == item.id);
        return {
          ...item,
          likes: item._count.Reaction,
          dislikes: dislikes._count.Reaction,
        };
      });
    }

    const allReactions = await this.prisma.reaction.findMany({
      where: {
        AND: [{ userId: viewerId }, { endTime: null }],
      },
    });
    const allVotes = await this.prisma.vote.findMany({
      where: {
        AND: { userId: viewerId },
      },
      select: {
        postId: true,
      },
    });

    return postList.map((item) => {
      const dislikes = postsWithDislikes.find((x) => x.id == item.id);
      const reaction = allReactions.find((x) => x.postId == item.id);
      const vote: boolean =
        allVotes.filter((voteItem) => voteItem.postId == item.id).length > 0;

      return {
        ...item,
        status: reaction ? reaction.type : 'NONE',
        likes: item._count.Reaction,
        dislikes: dislikes._count.Reaction,
        isVoted: vote,
      };
    });
  }

  async createUser(dto) {
    const newUser = await this.prisma.shortUser.create({
      data: {
        userId: dto.userId,
        nickname: dto.nickname,
        photo: dto.photo,
        linkNickname: dto.linkNickname,
      },
    });
    return newUser;
  }

  async updateUser(data) {
    await this.prisma.shortUser.update({
      where: {
        userId: data.userId,
      },
      data: {
        nickname: data.nickname,
        photo: data.photo,
      },
    });
    return true;
  }

  async banUser(userId: string) {
    const user = await this.prisma.shortUser.update({
      where: {
        userId,
      },
      data: {
        visible: false,
        role: 'BANNED_USER',
      },
    });
    return user;
  }

  async makeModerator(userId: string) {
    const user = await this.prisma.shortUser.update({
      where: {
        userId,
      },
      data: {
        role: 'MODERATOR',
        secondVerification: true,
      },
    });

    return user;
  }

  async cancelModerator(data) {
    const user = await this.prisma.shortUser.update({
      where: {
        userId: data,
      },
      data: {
        role: 'DEFAULT_USER',
      },
    });

    return user;
  }

  async postVerifyUser(userId: string) {
    const user = await this.prisma.shortUser.update({
      where: {
        userId,
      },
      data: {
        secondVerification: true,
      },
    });
    return user;
  }
}
