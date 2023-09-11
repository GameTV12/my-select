import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostCreatedEvent } from './events/post-created.event';
import { PrismaService } from './prisma/prisma.service';
import { PostDto } from './dtos/post.dto';
import { PostInterface } from './types/PostInterface';

export enum ReactionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: string, dto: PostDto) {
    const newPost = await this.prisma.post.create({
      data: {
        shortUserUserId: userId,
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
        commentsAllowed: dto.commentsAllowed,
        variantsAllowed: dto.variantsAllowed,
        video: dto.video,
      },
    });
    if (dto.photos) {
      await this.prisma.photo.deleteMany({
        where: {
          postId,
        },
      });
      await this.prisma.photo.createMany({
        data: dto.photos.map((item) => {
          return { link: item, postId: postId };
        }),
      });
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
        AND: {
          userId,
          endTime: null,
          postId,
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
                endTime: null,
                type: ReactionType.DISLIKE,
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
        AND: {
          userId: viewerId,
          endTime: null,
          postId: id,
        },
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

  async deleteVariant(variantId: string) {
    const variant = await this.prisma.variant.delete({
      where: {
        id: variantId,
      },
    });
  }

  async getPostListOfUser(userId: string, viewerId?: string) {
    const postList: PostInterface[] = await this.prisma.post.findMany({
      where: {
        user: {
          userId,
        },
        visible: false,
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
    const postsWithDislikes = await this.prisma.post.findMany({
      where: {
        user: {
          userId,
        },
        visible: false,
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
        const dislikes = postsWithDislikes.find((x) => (x.id = item.id));
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
    const allVotes = await this.prisma.vote.findMany({
      where: {
        AND: { userId: viewerId },
      },
    });

    return postList.map((item) => {
      const dislikes = postsWithDislikes.find((x) => (x.id = item.id));
      const reaction = allReactions.find((x) => x.postId == item.id);
      const vote: boolean = allVotes.includes({
        postId: item.id,
        userId: userId,
      });

      return {
        ...item,
        status: reaction.type,
        likes: item._count.Reaction,
        dislikes: dislikes._count.Reaction,
        voted: vote,
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
    //
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
    if (existingVote) throw new ForbiddenException('You have already voted');
    await this.prisma.vote.create({
      data: {
        postId: existingVote.postId,
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
        id: existingVote.postId,
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
        AND: {
          userId,
          endTime: null,
          postId,
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
      status: userReaction.length > 0 ? userReaction[0].type : null,
      isVoted: true,
    };
  }

  async getReactionInfo(postId: string) {
    //
  }

  async getPollInfo(postId: string) {
    //
  }

  // I must sort this by date up->to
  async getPostOfFollowings(viewerId: string, followings: string[]) {
    const postList: PostInterface[] = await this.prisma.post.findMany({
      where: {
        id: { in: followings },
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
        const dislikes = postsWithDislikes.find((x) => (x.id = item.id));
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
    const allVotes = await this.prisma.vote.findMany({
      where: {
        AND: { userId: viewerId },
      },
    });

    return postList.map((item) => {
      const dislikes = postsWithDislikes.find((x) => (x.id = item.id));
      const reaction = allReactions.find((x) => x.postId == item.id);
      const vote: boolean = allVotes.includes({
        postId: item.id,
        userId: viewerId,
      });

      return {
        ...item,
        status: reaction.type,
        likes: item._count.Reaction,
        dislikes: dislikes._count.Reaction,
        voted: vote,
      };
    });
  }

  async getTrendingPosts() {
    //
  }

  async searchPosts(args: string, viewerId: string) {
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
    });

    if (!viewerId) {
      return postList.map((item) => {
        const dislikes = postsWithDislikes.find((x) => (x.id = item.id));
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
    const allVotes = await this.prisma.vote.findMany({
      where: {
        AND: { userId: viewerId },
      },
    });

    return postList.map((item) => {
      const dislikes = postsWithDislikes.find((x) => (x.id = item.id));
      const reaction = allReactions.find((x) => x.postId == item.id);
      const vote: boolean = allVotes.includes({
        postId: item.id,
        userId: viewerId,
      });

      return {
        ...item,
        status: reaction.type,
        likes: item._count.Reaction,
        dislikes: dislikes._count.Reaction,
        voted: vote,
      };
    });
  }

  async handlePostCreated(postCreatedEvent: PostCreatedEvent) {
    console.log(postCreatedEvent);
    console.log(postCreatedEvent.createPostDto);
    console.log(postCreatedEvent.postId);
    return { answer: postCreatedEvent, secondAnswer: 902 };
  }
}
