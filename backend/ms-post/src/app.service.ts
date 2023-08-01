import {Inject, Injectable} from '@nestjs/common';
import {PostCreatedEvent} from "./events/post-created.event";
import {ClientKafka} from "@nestjs/microservices";
import {GetUserDto} from "./dtos/get-user.dto";

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'Hello World!';
  }

  handlePostCreated(postCreatedEvent: PostCreatedEvent) {
      console.log(postCreatedEvent)
      console.log(postCreatedEvent.createPostDto)
      console.log(postCreatedEvent.postId)
      return { answer: postCreatedEvent, secondAnswer: 902 }
  }
}
