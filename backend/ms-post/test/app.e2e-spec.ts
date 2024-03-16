import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { AppService } from '../src/app.service';
import { PostDto } from '../src/dtos/post.dto';

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

  describe('createPost', () => {
    const userId = 'user1';
    it('should create a new post', async () => {
      const mockPostDto: PostDto = {
        userId: userId,
        title: 'Test Post',
        text: 'This is a test post',
        commentsAllowed: true,
      };

      const mockPost = {
        id: 'post1',
        ...mockPostDto,
        commentsAllowed: true,
        variantsAllowed: false,
        visible: true,
        video: null,
        shortUserUserId: userId,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      jest.spyOn(prismaService.post, 'create').mockResolvedValue(mockPost);
      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(mockPost);

      const newPost = await appService.createPost(mockPostDto);

      expect(newPost).toEqual(mockPost);
    });

    it('should throw an error if the post creation fails', async () => {
      const mockPostDto: PostDto = {
        userId: userId,
        title: 'Test Post',
        text: 'This is a test post',
        commentsAllowed: true,
      };

      const errorMessage = 'Failed to create post';

      jest
        .spyOn(prismaService.post, 'create')
        .mockRejectedValue(new Error(errorMessage));

      await expect(appService.createPost(mockPostDto)).rejects.toThrow(
        errorMessage,
      );
    });
  });

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
      const post = {
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
        user: user,
      };
      const prismaServiceSpy = jest
        .spyOn(prismaService.shortUser, 'findUnique')
        .mockResolvedValue(user);
      const prismaServiceUpdateSpy = jest
        .spyOn(prismaService.post, 'update')
        .mockResolvedValue(post);
      const prismaServiceFindSpy = jest
        .spyOn(prismaService.post, 'findUnique')
        .mockResolvedValue(post);

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
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        user: user,
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
      const post = {
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
        user: user,
      };
      const prismaServiceSpy = jest
        .spyOn(prismaService.shortUser, 'findUnique')
        .mockResolvedValue(user);
      const prismaServiceUpdateSpy = jest
        .spyOn(prismaService.post, 'update')
        .mockResolvedValue(post);
      const prismaServiceFindSpy = jest
        .spyOn(prismaService.post, 'findUnique')
        .mockResolvedValue(post);

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
        user: user,
      });
    });
  });
});
