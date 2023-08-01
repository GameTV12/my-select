import {Controller, Get, Inject, OnModuleInit, ValidationPipe} from '@nestjs/common';
import { AppService } from './app.service';
import {ClientKafka, EventPattern, MessagePattern, Payload} from "@nestjs/microservices";
import {PostCreatedEvent} from "./events/post-created.event";

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('post_created')
  handlePostCreated(@Payload(ValidationPipe) data: PostCreatedEvent){
    console.log(3)
    return this.appService.handlePostCreated(data)
  }
}
