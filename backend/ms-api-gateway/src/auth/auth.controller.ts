import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Tokens } from './types';
import { LogInDto, CreateUserDto, EditUserDto } from '../dtos';
import { RtGuard } from './common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from './common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CheckDto } from '../dtos/check.dto';

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

  // google
  @Public()
  @Get('google/signin')
  @UseGuards(AuthGuard('google'))
  @HttpCode(HttpStatus.OK)
  signInGoogle() {
    //
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Public()
  @Get('google/logout')
  googleLogout(@Res() res) {
    res.redirect('https://mail.google.com/mail/u/0/?logout&hl=en');
    return { hi: 'guys' };
  }

  // fb
  @Public()
  @Get('fb/signin')
  @UseGuards(AuthGuard('facebook'))
  @HttpCode(HttpStatus.OK)
  signInFacebook() {
    //
  }

  @Public()
  @Get('fb/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Req() req) {
    return {
      data: req.user,
    };
  }

  @Public()
  @Get('fb/logout')
  facebookLogout(@Req() req, @Res() res) {
    //
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
