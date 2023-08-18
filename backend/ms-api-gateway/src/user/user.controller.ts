import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from '../auth/common/decorators';
import {
  CreateModeratorRequestDto,
  CreateReportDto,
  EditUserDto,
} from '../dtos';
import { GetCurrentUserRole } from '../auth/common/decorators/get-current-user-role.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Get('/:link')
  @HttpCode(HttpStatus.OK)
  getUserByNickname(@Param('link') linkNickname: string) {
    return this.userService.getUserByNickname(linkNickname);
  }

  @Get('/:id/requests')
  @HttpCode(HttpStatus.OK)
  getRequestsByUserId(
    @GetCurrentUser('role') user: string,
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
  ) {
    return { k: id, l: user };
  }

  @Get('/requests')
  @HttpCode(HttpStatus.OK)
  getAllRequests(@GetCurrentUser() user: any) {
    return 1;
  }

  @Get('/follow/:id')
  @HttpCode(HttpStatus.OK)
  getFollowToUser(@GetCurrentUserId() from: string, @Param('id') to: string) {
    return this.userService.followToUser(from, to);
  }

  @Public()
  @Get('/:id/followers')
  @HttpCode(HttpStatus.OK)
  getCurrentFollowers(@Param('id') linkNickname: string) {
    return this.userService.getCurrentFollowers(linkNickname);
  }

  @Public()
  @Get('/:id/followings')
  @HttpCode(HttpStatus.OK)
  getFullFollowings(@Param('id') linkNickname: string) {
    return this.userService.getFullFollowings(linkNickname);
  }

  @Post('/request/create')
  @HttpCode(HttpStatus.OK)
  createModeratorRequest(
    @Body() dto: CreateModeratorRequestDto,
    @GetCurrentUserRole() role: string,
  ) {
    return this.userService.createModeratorRequest(role, dto);
  }

  @Post('/reports/create')
  @HttpCode(HttpStatus.CREATED)
  createReport(
    @Body() dto: CreateReportDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.userService.createReport(userId, dto);
  }
}
