import {IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Length, MaxLength} from "class-validator";

export class GetUserDto {
    @IsNotEmpty()
    id: string

    @IsNotEmpty()
    @IsString()
    @Length(2, 80)
    nickname: string

    @IsNotEmpty()
    @IsString()
    @Length(2, 30)
    linkNickname: string

    @IsNotEmpty()
    @IsEmail()
    @MaxLength(100)
    email: string

    @IsOptional()
    @IsString()
    @MaxLength(400)
    photo: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(80)
    firstName: string

    @IsOptional()
    @IsString()
    @MaxLength(80)
    lastName: string

    @IsNotEmpty()
    @IsInt()
    birthday: number
}