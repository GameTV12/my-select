import { Test, TestingModule } from '@nestjs/testing';
import { AppService, ReactionType, Type } from '../src/app.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateCommentDto, EditCommentDto } from '../src/dtos';
import { ConfigService } from '@nestjs/config';
import { CommentType, UserRole } from '@prisma/client';

class MockConfigService {
  get(key: string) {
    if (key === 'DATABASE_URL') {
      return 'mock-database-url';
    }
  }
}

describe('AppService', () => {
  let appService: AppService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        PrismaService,
        {
          provide: ConfigService,
          useClass: MockConfigService,
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createComment', () => {
    it('should create a new comment with correct text, goalId, and userId', async () => {
      const dto: CreateCommentDto = {
        userId: 'user12',
        text: 'Test comment',
        goalId: 'goal1',
        type: Type.POST,
        replyTo: null,
      };

      const expectedResult = {
        id: 'comment90',
        userId: 'user12',
        text: 'Test comment',
        goalId: 'goal1',
        type: Type.POST,
        replyTo: null,
        visible: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      jest
        .spyOn(prismaService.comment, 'create')
        .mockResolvedValue(expectedResult);

      const result = await appService.createComment(dto);

      expect(result).toStrictEqual(expectedResult);
    });
  });

  describe('editComment', () => {
    it('should edit an existing comment with the provided data', async () => {
      const commentId = 'comment1';
      const dto: EditCommentDto = {
        id: commentId,
        text: 'Updated comment',
      };

      const existingComment = {
        id: commentId,
        userId: 'user12',
        text: 'Test comment 123',
        goalId: 'goal1',
        type: Type.POST,
        replyTo: null,
        visible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedComment = {
        ...existingComment,
        text: dto.text,
        updatedAt: expect.any(Date),
      };

      jest
        .spyOn(prismaService.comment, 'findUnique')
        .mockResolvedValue(existingComment);

      jest
        .spyOn(prismaService.comment, 'update')
        .mockResolvedValue(updatedComment);

      const result = await appService.updateComment(commentId, dto);

      expect(result).toEqual(updatedComment);
    });
  });

  describe('deleteComment', () => {
    it('should delete an existing comment with the provided commentId', async () => {
      const commentId = 'comment1';
      const user = {
        id: 'user1',
        linkNickname: 'userLink',
        nickname: 'nickname',
        photo: 'photo.jpg',
        visible: true,
        role: UserRole.DEFAULT_USER,
        secondVerification: true,
      };

      const expectComment = {
        id: commentId,
        userId: user.id,
        text: 'Test comment 123',
        goalId: 'goal1',
        type: Type.POST,
        replyTo: null,
        visible: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.shortUser, 'findUnique').mockResolvedValue(user);

      jest
        .spyOn(prismaService.comment, 'update')
        .mockResolvedValue(expectComment);

      const result = await appService.deleteComment(user.id, commentId);

      expect(result).toEqual(expectComment);
    });
  });

  describe('reactToComment', () => {
    it('should add a reaction to the comment with the provided commentId and userId', async () => {
      const commentId = 'comment1';
      const userId = 'user1';
      const reactionType = ReactionType.LIKE;

      const existingComment = {
        id: commentId,
        userId: 'user12',
        text: 'Test comment 123',
        goalId: 'goal1',
        type: Type.POST,
        replyTo: null,
        visible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const reaction = {
        id: 'reaction1',
        commentId: commentId,
        userId: userId,
        type: reactionType,
        startTime: expect.any(Date),
        endTime: expect.any(Date),
      };

      jest
        .spyOn(prismaService.comment, 'findUnique')
        .mockResolvedValue(existingComment);

      jest.spyOn(prismaService.reaction, 'create').mockResolvedValue(reaction);

      jest.spyOn(prismaService.reaction, 'update').mockResolvedValue(reaction);

      jest
        .spyOn(prismaService.reaction, 'findMany')
        .mockResolvedValue(Array(reaction));

      const result = await appService.reactOnComment(
        commentId,
        userId,
        reactionType,
      );

      expect(result).toEqual(reaction);
    });
  });

  describe('getAllCommentsOfUser', () => {
    it('should return all comments of a user with likes and dislikes when viewerId is null', async () => {
      const userId = 'user123';
      const time = new Date();
      const commentWithLikes = [
        {
          id: 'comment1',
          userId: 'user1',
          text: 'Comment 1',
          visible: true,
          type: CommentType.POST,
          goalId: 'goal1',
          createdAt: time,
          updatedAt: time,
          replyTo: null,
          _count: {
            Reaction: 10,
          },
        },
      ];
      const commentWithDislikes = [
        {
          id: 'comment1',
          userId: 'user1',
          text: 'Comment 1',
          visible: true,
          type: CommentType.POST,
          goalId: 'goal1',
          createdAt: time,
          updatedAt: time,
          replyTo: null,
          _count: {
            Reaction: 10,
          },
        },
      ];

      jest
        .spyOn(prismaService.comment, 'findMany')
        .mockResolvedValue(commentWithLikes);
      jest
        .spyOn(prismaService.comment, 'findMany')
        .mockResolvedValue(commentWithDislikes);

      const result = await appService.getAllCommentsOfUser(userId);

      expect(result).toEqual([
        {
          id: 'comment1',
          text: 'Comment 1',
          goalId: 'goal1',
          userId: 'user1',
          replyTo: null,
          likes: commentWithLikes[0]._count.Reaction,
          dislikes: commentWithDislikes[0]._count.Reaction,
          type: 'POST',
          createdAt: time,
          updatedAt: time,
          visible: true,
          _count: {
            Reaction: 10,
          },
        },
      ]);
    });
  });
});
