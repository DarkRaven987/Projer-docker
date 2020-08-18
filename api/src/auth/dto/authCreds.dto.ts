import { IsString, MinLength, MaxLength, Matches, IsInt, IsOptional, IsDate, IsNotEmpty, IsEmail } from "class-validator";
import { createParamDecorator } from "@nestjs/common";
export class SignUpDto {
    @IsString()
    @MinLength(2)
    firstName: string;

    @IsString()
    @MinLength(2)
    secondName: string;

    @IsString()
    @MinLength(4)
    @MaxLength(16)
    username: string;

    @IsString()
    @IsEmail()
    mail: string;

    @IsString()
    @MinLength(8)
    @MaxLength(14)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak'})
    password: string;
}

export class SignInDto {
    @IsString()
    @MinLength(4)
    @MaxLength(16)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(14)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak'})
    password: string;
}

export class UpdateForgotPassword {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    mail: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(14)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak'})
    password: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}

export class RequestForgotPassword {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    mail: string
}

export class ValidateToken {
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    mail: string
}

export class GetUserDto {
    @IsInt()
    id: number;

    @IsString()
    firstName: string;

    @IsString()
    secondName: string;

    @IsString()
    role: string;

    @IsString()
    username: string;

    @IsString()
    @IsEmail()
    mail: string;
    
    @IsDate()
    createdAt: Date;

    @IsDate()
    updatedAt: Date;
}

export class FilterUsersDto {
    @IsOptional()
    filter: string;
    
    @IsOptional()
    role: number;

    @IsOptional()
    limit: number;

    @IsOptional()
    page: number;
}

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(14)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak'})
    newPassword: string;
}

export const CheckUser = createParamDecorator((data, req) => {
    return req.args[0].user;
})

export interface IGetUsers {
    users: Array<GetUserDto>,
    totalCount: number,
    pages: number,
}