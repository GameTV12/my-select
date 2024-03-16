import { Controller, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { CreateReportDto, CreateUserDto, DecideRequestsDto } from './dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create_user')
  createUser(
    @Payload(ValidationPipe) data: { dto: CreateUserDto; pass: string },
  ) {
    return this.appService.createUser(data.dto);
  }

  @MessagePattern('update_user')
  editUser(@Payload(ValidationPipe) data: { dto; userId: string }) {
    return this.appService.updateUser(data.dto, data.userId);
  }

  @MessagePattern('ban_user')
  banUser(
    @Payload(ValidationPipe) data: { userId: string; unlockTime: number },
  ) {
    return this.appService.banUser(data.userId, data.unlockTime);
  }

  @MessagePattern('get_current_user')
  getCurrentUser(@Payload(ValidationPipe) userId: string) {
    return this.appService.getCurrentUser(userId);
  }

  @MessagePattern('get_nickname')
  getUserByLinkNickname(@Payload(ValidationPipe) linkNickname: string) {
    return this.appService.getUserByLinkNickname(linkNickname);
  }

  @MessagePattern('get_user_info')
  getUserInfo(@Payload(ValidationPipe) { linkNickname, viewerId }) {
    return this.appService.getUserInfo(linkNickname, viewerId);
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
    @Payload(ValidationPipe) dto: { userId: string; text: string },
  ) {
    return this.appService.createModeratorRequest(dto);
  }

  @MessagePattern('show_moderator_request_id')
  showModeratorRequestsById(@Payload(ValidationPipe) userId: string) {
    return this.appService.showModeratorRequestsById(userId);
  }

  @MessagePattern('user_cancel_moderator')
  cancelModerator(@Payload(ValidationPipe) userId: string) {
    return this.appService.cancelModerator(userId);
  }

  @MessagePattern('show_waiting_requests')
  showWaitingRequests(@Payload(ValidationPipe) dto) {
    return this.appService.showWaitingRequests();
  }

  @MessagePattern('decide_request')
  decideRequest(@Payload(ValidationPipe) dto: DecideRequestsDto) {
    return this.appService.decideRequest(dto);
  }

  @MessagePattern('create_report')
  createReport(@Payload(ValidationPipe) dto: CreateReportDto) {
    return this.appService.createReport(dto);
  }

  @MessagePattern('show_reports')
  showReports(@Payload(ValidationPipe) dto) {
    return this.appService.showReports();
  }

  @MessagePattern('first_verify_user')
  firstVerify(@Payload(ValidationPipe) dto) {
    return this.appService.firstVerify(dto.linkNickname);
  }

  @MessagePattern('second_verify_user')
  secondVerify(@Payload(ValidationPipe) dto) {
    return this.appService.secondVerify(dto.id);
  }

  @MessagePattern('get_followers_statistics')
  getFollowersStatistics(@Payload(ValidationPipe) dto) {
    return this.appService.getFullFollowers(dto.linkNickname);
  }
}
