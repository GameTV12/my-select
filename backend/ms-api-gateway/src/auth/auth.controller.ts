import {Body, Controller, Get, Post, ValidationPipe} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateUserDto} from "../dtos/create-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post()
    createNewUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
        return this.authService.createNewUser(createUserDto)
    }
}
