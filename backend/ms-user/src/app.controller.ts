import { Controller, Get, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('create_user')
  getUser(@Payload(ValidationPipe) data: { dto: CreateUserDto; pass: string }) {
    console.log(78);
    return this.appService.createUser(data.dto, data.pass);
  }
}
