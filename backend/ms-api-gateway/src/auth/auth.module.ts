import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
          {
            name: 'USER_SERVICE',
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'user',
                brokers: ['localhost:9092'],
              },
              consumer: {
                groupId: 'user-consumer',
              },
            },
          },
  ])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
