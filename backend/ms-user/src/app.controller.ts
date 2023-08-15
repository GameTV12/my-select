import { Controller, Get, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dtos';

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

  @MessagePattern('get_full_followers')
  getFullFollowers(@Payload(ValidationPipe) userId: string) {
    return this.appService.getFullFollowers(userId);
  }
}
