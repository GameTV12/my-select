import {Module} from '@nestjs/common';
import {PostController} from './post.controller';
import {PostService} from './post.service';
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [ClientsModule.register([
    {
      name: 'POST_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'post',
          brokers: ['localhost:9092']
        },
        consumer: {
          groupId: 'post-consumer'
        }
      }
    }
  ])],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
