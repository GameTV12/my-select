import { Controller, Get, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PostCreatedEvent } from './events/post-created.event';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('post_created')
  handlePostCreated(@Payload(ValidationPipe) data: PostCreatedEvent) {
    return this.appService.handlePostCreated(data);
  }
}
