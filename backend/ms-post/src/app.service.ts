import { Injectable } from '@nestjs/common';
import { PostCreatedEvent } from './events/post-created.event';

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'Hello World!';
  }

  handlePostCreated(postCreatedEvent: PostCreatedEvent) {
    console.log(postCreatedEvent);
    console.log(postCreatedEvent.createPostDto);
    console.log(postCreatedEvent.postId);
    return { answer: postCreatedEvent, secondAnswer: 902 };
  }
}
