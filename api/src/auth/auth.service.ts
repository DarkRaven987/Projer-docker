import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { SignUpDto, SignInDto, GetUserDto, UpdateForgotPassword, RequestForgotPassword } from './dto/authCreds.dto';
import { JwtService } from '@nestjs/jwt';
import { RoleRepository } from '../roles/roles.repository';
import { AppGateway } from '../app.gateway';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @InjectRepository(RoleRepository)
        private roleRepository: RoleRepository,
        private jwtService: JwtService,
        private gateway: AppGateway
    ) {}

    async signUp(authCredsDto: SignUpDto): Promise<void> {
        return await this.userRepository.signUp(authCredsDto, this.roleRepository, this.gateway);
    }

    async signIn(authCredsDto: SignInDto): Promise<{accessToken: string, user: GetUserDto}> {
        return this.userRepository.signIn(authCredsDto, this.userRepository, this.roleRepository, this.jwtService)
    }

    async forgotPasswordRequest(forgotPasswordReqDto: RequestForgotPassword): Promise<void> {
        return this.userRepository.forgotPasswordRequest(forgotPasswordReqDto)
    }

    async forgotPassword(forgotPasswordDto: UpdateForgotPassword): Promise<void> {
        return this.userRepository.forgotPassword(forgotPasswordDto, this.userRepository);
    }
}
