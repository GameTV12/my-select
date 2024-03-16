import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Status, UserRole } from '@prisma/client';

import {
  CreateModeratorRequestDto,
  CreateUserDto,
  EditUserDto,
} from '../src/dtos';

import { AppService } from '../src/app.service';
import { PrismaService } from 'nestjs-prisma';

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

  describe('createUser', () => {
    it('should create a new user', async () => {
      const expectedValue = {
        id: 'mock-user-id',
        nickname: 'testuser',
        linkNickname: 'testuser',
        photo: 'testuser.jpg',
        email: 'testuser@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890',
        visible: true,
        unlockTime: null,
        birthday: expect.any(Date),
        firstVerification: true,
        role: UserRole.DEFAULT_USER,
        secondVerification: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };
      const createMock = jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValueOnce(expectedValue);

      const userDto: CreateUserDto = {
        nickname: 'testuser',
        linkNickname: 'testuser',
        password: 'pass',
        birthday: 1212431325,
        email: 'testuser@example.com',
        firstName: 'Test',
        lastName: 'User',
        photo: 'testuser.jpg',
        phone: '1234567890',
        firstVerification: true,
      };

      const result = await appService.createUser(userDto);

      expect(createMock).toHaveBeenCalledWith({
        data: {
          nickname: 'testuser',
          linkNickname: 'testuser',
          birthday: expect.any(Date),
          email: 'testuser@example.com',
          firstName: 'Test',
          lastName: 'User',
          photo: 'testuser.jpg',
          phone: '1234567890',
          firstVerification: true,
        },
      });

      expect(result).toBe('mock-user-id');
    });
  });

  describe('updateUser', () => {
    it('should update the user with the provided data', async () => {
      const userId = '123';
      const userDto: EditUserDto = {
        nickname: 'newNickname',
        linkNickname: 'newLinkNickname',
        photo: 'newphoto.jpg',
      };

      const expectedValue = {
        id: userId,
        nickname: 'testuser',
        linkNickname: 'testuser',
        photo: 'testuser.jpg',
        email: 'testuser@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890',
        visible: true,
        unlockTime: null,
        birthday: expect.any(Date),
        firstVerification: true,
        role: UserRole.DEFAULT_USER,
        secondVerification: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      const updateSpy = jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValueOnce(expectedValue);

      await appService.updateUser(userDto, userId);

      expect(updateSpy).toHaveBeenCalledWith({
        where: {
          id: userId,
        },
        data: {
          nickname: userDto.nickname,
          linkNickname: userDto.linkNickname,
          photo: userDto.photo,
        },
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should return the user with the given userId', async () => {
      const userId = '123';

      const expectedUser = {
        id: 'mock-user-id',
        nickname: 'testuser',
        linkNickname: 'testuser',
        photo: 'testuser.jpg',
        email: 'testuser@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890',
        visible: true,
        unlockTime: null,
        birthday: expect.any(Date),
        firstVerification: true,
        role: UserRole.DEFAULT_USER,
        secondVerification: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(expectedUser);

      const user = await appService.getCurrentUser(userId);

      expect(user).toEqual(expectedUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: userId,
        },
      });
    });
  });

  describe('getCurrentFollowers', () => {
    it('should return the current followers of a user', async () => {
      const userId = '123';

      const expectedFollowers = [
        {
          follower: 'user1',
          following: 'user2',
          end: null,
          start: new Date(),
        },
        {
          follower: 'user3',
          following: 'user2',
          end: null,
          start: new Date(),
        },
      ];

      jest
        .spyOn(prismaService.followers, 'findMany')
        .mockResolvedValue(expectedFollowers);

      const followers = await appService.getCurrentFollowers(userId);

      expect(followers).toEqual(expectedFollowers);
      expect(prismaService.followers.findMany).toHaveBeenCalledWith({
        where: {
          AND: [{ following: userId }, { end: null }],
        },
      });
    });
  });

  describe('createModeratorRequest', () => {
    it('should create a moderator request', async () => {
      const createModeratorRequestDto: CreateModeratorRequestDto = {
        userId: 'user123',
        text: 'Moderator request text',
      };

      const expectedResult = {
        id: 'request123',
        userId: 'user123',
        text: 'Moderator request text',
        status: Status.WAITING,
        courtId: null,
      };

      jest
        .spyOn(prismaService.request, 'create')
        .mockResolvedValue(expectedResult);

      const result = await appService.createModeratorRequest(
        createModeratorRequestDto,
      );

      expect(result).toEqual(expectedResult);
      expect(prismaService.request.create).toHaveBeenCalledWith({
        data: {
          userId: 'user123',
          text: 'Moderator request text',
        },
      });
    });
  });

  describe('createReport', () => {
    it('should create a report', async () => {
      const senderId = 'senderId';
      const reportedUserId = 'reportedUserId';
      const text = 'This is a report';

      const createReportSpy = jest
        .spyOn(prismaService.report, 'create')
        .mockResolvedValueOnce({
          id: 'reportId',
          senderId,
          reportedUserId,
          text,
        });

      const result = await appService.createReport({
        senderId,
        reportedUserId,
        text,
      });

      expect(createReportSpy).toHaveBeenCalledWith({
        data: {
          senderId,
          reportedUserId,
          text,
        },
      });
      expect(result).toEqual({
        id: 'reportId',
        senderId,
        reportedUserId,
        text,
      });
    });
  });

  describe('banUser', () => {
    it('should ban a user and return the updated user', async () => {
      const userId = '123';
      const unlockTime = 1638297600000;

      const expectedUser = {
        id: userId,
        nickname: 'testuser',
        linkNickname: 'testuser',
        photo: 'testuser.jpg',
        email: 'testuser@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890',
        visible: false,
        unlockTime: new Date(unlockTime),
        birthday: expect.any(Date),
        firstVerification: true,
        role: UserRole.DEFAULT_USER,
        secondVerification: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      const updateSpy = jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue(expectedUser);

      const result = await appService.banUser(userId, unlockTime);

      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          visible: false,
          unlockTime: new Date(unlockTime),
          role: 'BANNED_USER',
        },
      });
      expect(result).toBeDefined();
    });
  });
});
