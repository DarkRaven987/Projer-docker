import { Controller, Post, Body, ValidationPipe, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto, GetUserDto, UpdateForgotPassword, RequestForgotPassword } from './dto/authCreds.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    private logger = new Logger('AuthController');
    
    @Post('signup')
    async signUp(
        @Body(ValidationPipe) authCredsDto: SignUpDto
    ): Promise<void> {
        this.logger.verbose('Registration of new user...')
        return this.authService.signUp(authCredsDto)
    }

    @Post('signin')
    async signIn(
        @Body(ValidationPipe) authCredsDto: SignInDto
    ): Promise<{ accessToken: string, user: GetUserDto }> {
        this.logger.verbose(`Logining for user '${authCredsDto.username}'...`)
        return this.authService.signIn(authCredsDto)
    }

    @Post('forgot-send')
    async getForgotPasswordRequest(
        @Body(ValidationPipe) forgotPasswordReqDto: RequestForgotPassword
    ):Promise<void> {
        this.logger.verbose(`User with email "${forgotPasswordReqDto.mail}" sent request since password forgotten...`);
        return this.authService.forgotPasswordRequest(forgotPasswordReqDto);
    }

    @Post('forgot-confirm')
    async forgotPassword(
        @Body(ValidationPipe) forgotPasswordDto: UpdateForgotPassword
    ): Promise<void> {
        this.logger.verbose(`User with email "${forgotPasswordDto.mail}" confirmed password reset... `);
        return this.authService.forgotPassword(forgotPasswordDto);
    }
}
