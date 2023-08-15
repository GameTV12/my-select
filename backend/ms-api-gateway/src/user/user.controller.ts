import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UserService } from './user.service';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from '../auth/common/decorators';

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
  getCurrentFollowers(@Param('id') userId: string) {
    return this.userService.getCurrentFollowers(userId);
  }
}
