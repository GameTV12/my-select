import { Module } from '@nestjs/common';

import { KafkaModule } from '../kafka';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [KafkaModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
