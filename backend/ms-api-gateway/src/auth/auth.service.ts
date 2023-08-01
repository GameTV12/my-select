import {Inject, Injectable} from '@nestjs/common';
import {ClientKafka} from "@nestjs/microservices";
import {CreateUserDto} from "../dtos/create-user.dto";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        @Inject('USER_SERVICE') private readonly authClient: ClientKafka,
        private jwt: JwtService,
        private config: ConfigService
    ) {}

    async signToken(
        userId: string,
        email: string,
    ) {
        const payload = {
            sub: userId,
            email,
        };
        const secret = this.config.get('JWT_SECRET')

        const accessToken = await this.jwt.signAsync(payload, {
            expiresIn: 45,
            secret: secret
        })

        const refreshToken = await this.jwt.signAsync(payload, {
            expiresIn: 3600*24*90,
            secret: 'refresh'+secret
        })

        return {access: accessToken, refresh: refreshToken}
    }

    createNewUser(createUserDto: CreateUserDto) {
        this.authClient.emit('user_created', createUserDto)
    }
}
