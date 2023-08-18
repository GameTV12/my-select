import { Controller, Get, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateModeratorRequestDto, CreateUserDto } from './dtos';
import { CreateReportDto } from './dtos/create-report.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('create_user')
  getUser(@Payload(ValidationPipe) data: { dto: CreateUserDto; pass: string }) {
    return this.appService.createUser(data.dto);
  }

  @MessagePattern('update_user')
  editUser(@Payload(ValidationPipe) data: { dto; userId: string }) {
    return this.appService.updateUser(data.dto, data.userId);
  }

  @MessagePattern('get_current_user')
  getCurrentUser(@Payload(ValidationPipe) userId: string) {
    return this.appService.getCurrentUser(userId);
  }

  @MessagePattern('get_nickname')
  getUserByLinkNickname(@Payload(ValidationPipe) linkNickname: string) {
    return this.appService.getUserByLinkNickname(linkNickname);
  }

  @MessagePattern('follow_to_user')
  followToUser(@Payload(ValidationPipe) dto: { from: string; to: string }) {
    return this.appService.followToUser(dto.from, dto.to);
  }

  @MessagePattern('get_current_followers')
  getCurrentFollowers(@Payload(ValidationPipe) linkNickname: string) {
    return this.appService.getCurrentFollowers(linkNickname);
  }

  @MessagePattern('get_full_followings')
  getFullFollowings(@Payload(ValidationPipe) userId: string) {
    return this.appService.getFullFollowings(userId);
  }

  @MessagePattern('create_moderator_request')
  createModeratorRequest(
    @Payload(ValidationPipe) dto: CreateModeratorRequestDto,
  ) {
    return this.appService.createModeratorRequest(dto);
  }

  @MessagePattern('show_moderator_request_id')
  showModeratorRequestsById(@Payload(ValidationPipe) userId: string) {
    return this.appService.showModeratorRequestsById(userId);
  }

  @MessagePattern('show_waiting_requests')
  showWaitingRequests() {
    return this.appService.showWaitingRequests();
  }

  @MessagePattern('decide_request')
  decideRequest(
    @Payload(ValidationPipe)
    data: {
      requestId: string;
      adminId: string;
      decision: string;
    },
  ) {
    return this.appService.decideRequest(
      data.requestId,
      data.adminId,
      data.decision,
    );
  }

  @MessagePattern('create_report')
  createReport(@Payload(ValidationPipe) dto: CreateReportDto) {
    console.log(dto);
    return this.appService.createReport(dto);
  }

  @MessagePattern('show_reports')
  showReports() {
    return this.appService.showReports();
  }

  @MessagePattern('ban_user')
  banUser(
    @Payload(ValidationPipe) data: { userId: string; unlockTime: number },
  ) {
    return this.appService.banUser(data.userId, data.unlockTime);
  }
}
