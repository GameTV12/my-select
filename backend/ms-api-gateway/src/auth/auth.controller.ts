import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Tokens } from './types';
import { LogInDto, CreateUserDto, EditUserDto } from '../dtos';
import { RtGuard } from './common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from './common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: CreateUserDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Public()
  @Post('local/check')
  checkUniqueEmailOrLink(@Body() body: { value: string; type: string }) {
    return this.authService.checkUniqueEmailOrLink(body.value, body.type);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: LogInDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }

  @Patch('edit')
  @HttpCode(HttpStatus.OK)
  updateUser(@GetCurrentUserId() userId: string, @Body() dto: EditUserDto) {
    return this.authService.updateUser(userId, dto);
  }

  @Get('me')
  getCurrentUser(@GetCurrentUserId() userId: string) {
    return this.authService.getCurrentUser(userId);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
