import { Test, TestingModule } from '@nestjs/testing';
import { AppService, ReactionType } from '../src/app.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PostDto } from '../src/dtos/post.dto';
import { UserRole } from '@prisma/client';

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

  // describe('createPost', () => {
  //   const userId = 'user1';
  //   it('should create a new post', async () => {
  //     const mockPostDto: PostDto = {
  //       title: 'Test Post',
  //       text: 'This is a test post',
  //       commentsAllowed: true,
  //     };
  //
  //     const mockPost = {
  //       id: 'post1',
  //       ...mockPostDto,
  //       commentsAllowed: true,
  //       variantsAllowed: false,
  //       visible: true,
  //       video: null,
  //       shortUserUserId: userId,
  //       createdAt: expect.any(Date),
  //       updatedAt: expect.any(Date),
  //     };
  //
  //     jest.spyOn(prismaService.post, 'create').mockResolvedValue(mockPost);
  //     jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(mockPost);
  //
  //     const newPost = await appService.createPost(userId, mockPostDto);
  //
  //     expect(newPost).toEqual(mockPost);
  //   });
  //
  //   it('should throw an error if the post creation fails', async () => {
  //     const mockPostDto: PostDto = {
  //       title: 'Test Post',
  //       text: 'This is a test post',
  //       commentsAllowed: true,
  //     };
  //
  //     const errorMessage = 'Failed to create post';
  //
  //     jest
  //       .spyOn(prismaService.post, 'create')
  //       .mockRejectedValue(new Error(errorMessage));
  //
  //     await expect(appService.createPost(userId, mockPostDto)).rejects.toThrow(
  //       errorMessage,
  //     );
  //   });
  // });

  describe('deletePost', () => {
    it('should delete a post if the user is the owner', async () => {
      const userId = 'user123';
      const postId = 'post123';
      const user = {
        userId: 'user123',
        linkNickname: 'user123',
        nickname: 'User 123',
        photo: 'user123.jpg',
        visible: true,
        role: UserRole.DEFAULT_USER,
        secondVerification: false,
      };
      const prismaServiceSpy = jest
        .spyOn(prismaService.shortUser, 'findUnique')
        .mockResolvedValue(user);
      const prismaServiceUpdateSpy = jest
        .spyOn(prismaService.post, 'update')
        .mockResolvedValue({
          id: postId,
          shortUserUserId: userId,
          title: 'Test Post',
          text: 'This is a test post',
          commentsAllowed: true,
          variantsAllowed: false,
          video: null,
          visible: false,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });

      const result = await appService.deletePost(userId, postId);

      expect(prismaServiceSpy).toHaveBeenCalledWith({ where: { userId } });
      expect(prismaServiceUpdateSpy).toHaveBeenCalledWith({
        where: { id: postId, userId },
        data: { visible: false },
      });
      expect(result).toEqual({
        id: postId,
        shortUserUserId: userId,
        title: 'Test Post',
        text: 'This is a test post',
        commentsAllowed: true,
        variantsAllowed: false,
        video: null,
        visible: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should delete a post if the user is a moderator', async () => {
      const userId = 'user123';
      const postId = 'post123';
      const user = {
        userId: 'user123',
        linkNickname: 'user123',
        nickname: 'User 123',
        photo: 'user123.jpg',
        visible: true,
        role: UserRole.MODERATOR,
        secondVerification: false,
      };
      const prismaServiceSpy = jest
        .spyOn(prismaService.shortUser, 'findUnique')
        .mockResolvedValue(user);
      const prismaServiceUpdateSpy = jest
        .spyOn(prismaService.post, 'update')
        .mockResolvedValue({
          id: postId,
          shortUserUserId: userId,
          title: 'Test Post',
          text: 'This is a test post',
          commentsAllowed: true,
          variantsAllowed: false,
          video: null,
          visible: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      const result = await appService.deletePost(userId, postId);

      expect(prismaServiceSpy).toHaveBeenCalledWith({ where: { userId } });
      expect(prismaServiceUpdateSpy).toHaveBeenCalledWith({
        where: { id: postId },
        data: { visible: false },
      });
      expect(result).toEqual({
        id: postId,
        shortUserUserId: userId,
        title: 'Test Post',
        text: 'This is a test post',
        commentsAllowed: true,
        variantsAllowed: false,
        video: null,
        visible: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  });

  // describe('addVariant', () => {
  //   it('should add a new variant to the post', async () => {
  //     const postId = 'post-id';
  //     const userId = 'user-id';
  //     const variant = 'New Variant';
  //
  //     const findUniqueSpy = jest
  //       .spyOn(prismaService.post, 'findUnique')
  //       .mockResolvedValueOnce({
  //         id: postId,
  //         shortUserUserId: 'user-id',
  //         title: 'Post Title',
  //         text: 'Post Text',
  //         commentsAllowed: true,
  //         variantsAllowed: true,
  //         video: 'Post Video',
  //         visible: true,
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //       });
  //
  //     const findUniqueVoteSpy = jest
  //       .spyOn(prismaService.vote, 'findUnique')
  //       .mockResolvedValueOnce(null);
  //
  //     const createVoteSpy = jest.spyOn(prismaService.vote, 'create');
  //
  //     const createVariantSpy = jest.spyOn(prismaService.variant, 'create');
  //
  //     const findUniquePostSpy = jest
  //       .spyOn(prismaService.post, 'findUnique')
  //       .mockResolvedValueOnce({
  //         id: postId,
  //         title: 'Post Title',
  //         shortUserUserId: userId,
  //         text: 'Post Text',
  //         video: 'Post Video',
  //         variantsAllowed: true,
  //         commentsAllowed: true,
  //         Variants: [],
  //         Photo: [],
  //         user: {
  //           userId: userId,
  //           nickname: 'User Nickname',
  //           linkNickname: 'User Link Nickname',
  //           photo: 'User Photo',
  //           role: 'User Role',
  //           secondVerification: true,
  //         },
  //         _count: {
  //           Reaction: {
  //             where: {
  //               endTime: null,
  //               type: ReactionType.LIKE,
  //             },
  //           },
  //         },
  //       });
  //
  //     const findUniqueDislikesSpy = jest
  //       .spyOn(prismaService.post, 'findUnique')
  //       .mockResolvedValueOnce({
  //         _count: {
  //           Reaction: {
  //             where: {
  //               endTime: null,
  //               type: ReactionType.DISLIKE,
  //             },
  //           },
  //         },
  //       });
  //
  //     const findManyReactionSpy = jest
  //       .spyOn(prismaService.reaction, 'findMany')
  //       .mockResolvedValueOnce([]);
  //
  //     const findUniqueVoteSpy2 = jest
  //       .spyOn(prismaService.vote, 'findUnique')
  //       .mockResolvedValueOnce(null);
  //
  //     const result = await appService.addVariant(postId, userId, variant);
  //
  //     // Assert
  //     expect(findUniqueSpy).toHaveBeenCalledWith({
  //       where: {
  //         id: postId,
  //       },
  //     });
  //     expect(findUniqueVoteSpy).toHaveBeenCalledWith({
  //       where: {
  //         userId_postId: {
  //           userId,
  //           postId,
  //         },
  //       },
  //     });
  //     expect(createVoteSpy).toHaveBeenCalledWith({
  //       data: {
  //         postId,
  //         userId,
  //       },
  //     });
  //     expect(createVariantSpy).toHaveBeenCalledWith({
  //       data: {
  //         votes: 1,
  //         text: variant,
  //         postId,
  //       },
  //     });
  //   });
  // });
});
