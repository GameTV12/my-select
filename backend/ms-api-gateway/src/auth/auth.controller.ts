import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/signup')
  signupLocal(@Body(ValidationPipe) dto: CreateUserDto) {
    return this.authService.signupLocal(dto);
  }

  // @Post('local/signin')
  // signinLocal() {
  //   this.authService.signinLocal();
  // }
  //
  // @Post('logout')
  // logout() {
  //   this.authService.logout();
  // }
  //
  // @Post('refresh')
  // refreshTokens() {
  //   this.authService.refreshTokens();
  // }
}
