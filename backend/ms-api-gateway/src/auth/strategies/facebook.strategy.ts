import { PassportStrategy } from '@nestjs/passport';

import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

import { Injectable } from '@nestjs/common';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private config: ConfigService) {
    super({
      clientID: config.get('FACEBOOK_CLIENT_ID'),
      clientSecret: config.get('FACEBOOK_CLIENT_SECRET'),
      callbackURL: config.get('FACEBOOK_CLIENT_CALLBACK_URL'),
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ) {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      data: profile,
    };
    const payload = {
      user,
      accessToken,
    };
    done(null, payload);
  }
}
