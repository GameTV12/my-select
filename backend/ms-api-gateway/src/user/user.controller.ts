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
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: string) {
    return 1;
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
}
