import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetCurrentUserId, Public, Roles } from '../auth/common/decorators';
import {
  BanUserDto,
  CreateModeratorRequestDto,
  CreateReportDto,
  Decision,
} from '../dtos';
import { RolesGuard } from '../auth/common/guards/roles.guard';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

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
  @ApiOkResponse({ description: 'OK', type: '' })
  @ApiNotFoundResponse({ description: 'User not found' })
  getFullFollowings(@Param('id') linkNickname: string) {
    return this.userService.getFullFollowings(linkNickname);
  }

  //@Roles(['ADMIN'])
  //@UseGuards(RolesGuard)
  @Public()
  @Get('/moderator')
  @HttpCode(HttpStatus.OK)
  showWaitingRequests() {
    return this.userService.showWaitingRequests();
  }

  @Post('/moderator/create')
  @Roles(['DEFAULT_USER'])
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  createModeratorRequest(
    @Body() dto: CreateModeratorRequestDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.userService.createModeratorRequest(userId, dto.text);
  }

  @Get('/moderator/:link')
  @HttpCode(HttpStatus.OK)
  @Roles(['ADMIN'])
  @UseGuards(RolesGuard)
  showModeratorRequestsById(@Param('link') linkNickname: string) {
    return this.userService.showModeratorRequestsById(linkNickname);
  }

  @Get('/moderator/:id/accept')
  @Roles(['ADMIN'])
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  acceptRequest(@GetCurrentUserId() adminId: string, @Param('id') id: string) {
    return this.userService.decideRequest(adminId, id, Decision.ACCEPTED);
  }

  @Get('/moderator/:id/deny')
  @Roles(['ADMIN'])
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  denyRequest(@GetCurrentUserId() adminId: string, @Param('id') id: string) {
    return this.userService.decideRequest(adminId, id, Decision.DENIED);
  }

  @Post('/reports/create')
  @HttpCode(HttpStatus.CREATED)
  createReport(
    @Body() dto: CreateReportDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.userService.createReport(userId, dto);
  }

  @Get('/reports')
  @Public() //
  // @Roles(['MODERATOR', 'ADMIN'])
  // @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  showReports() {
    return this.userService.showReports();
  }

  @Post('/ban')
  @Roles(['MODERATOR', 'ADMIN'])
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  banUser(@Body() dto: BanUserDto, @GetCurrentUserId() adminId: string) {
    return this.userService.banUser(dto.userId, dto.unlockTime);
  }

  @Get('/info/:link/auth')
  @HttpCode(HttpStatus.OK)
  getUserInfoAuth(
    @Param('link') linkNickname: string,
    @GetCurrentUserId() viewerId,
  ) {
    return this.userService.getUserInfo(linkNickname, viewerId);
  }

  @Public()
  @Get('/info/:link')
  @HttpCode(HttpStatus.OK)
  getUserInfo(@Param('link') linkNickname: string) {
    return this.userService.getUserInfo(linkNickname);
  }

  @Public()
  @Get('/:link')
  @HttpCode(HttpStatus.OK)
  getUserByNickname(@Param('link') linkNickname: string) {
    return this.userService.getUserByNickname(linkNickname);
  }
}
