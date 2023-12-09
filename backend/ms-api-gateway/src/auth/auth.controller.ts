import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto, EditUserDto, LogInDto } from '../dtos';
import { CheckDto } from '../dtos/check.dto';
import { AuthService } from './auth.service';
import { GetCurrentUser, GetCurrentUserId, Public } from './common/decorators';
import { RtGuard } from './common/guards';
import { Tokens } from './types';

@ApiTags('Auth')
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
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'OK', type: Boolean })
  checkUniqueEmailOrLink(@Body() body: CheckDto) {
    return this.authService.checkUniqueEmailOrLink(body.value, body.type);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: LogInDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }

  @Public()
  @Get('local/firstVerification/:link')
  @HttpCode(HttpStatus.OK)
  firstVerificationRequest(@Param('link') link: string) {
    return this.authService.firstVerify(link);
  }

  @Public()
  @Get('local/secondVerification/:id')
  @HttpCode(HttpStatus.OK)
  secondVerificationRequest(@Param('id') id: string) {
    return this.authService.secondVerify(id);
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
