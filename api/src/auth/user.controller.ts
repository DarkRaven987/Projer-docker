import { Controller, Get, Query, ValidationPipe, Patch, Param, ParseIntPipe, Body, Delete, UseGuards, Logger } from "@nestjs/common";
import { UserService } from "./user.service";
import { GetUserDto, FilterUsersDto, CheckUser, ResetPasswordDto, IGetUsers } from "./dto/authCreds.dto";
import { AuthGuard } from "@nestjs/passport";
import { User } from "./user.entity";

@Controller('users')
@UseGuards(AuthGuard())
export class UserController {
    constructor (
        private userService: UserService
    ) {}

    private logger = new Logger('UserController');

    @Get()
    async getUsers(
        @Query(ValidationPipe) filterDto: FilterUsersDto,
        @CheckUser() user: User
    ): Promise<IGetUsers> {
        this.logger.verbose(`User '${user.username}' requesting users list with filter { ${JSON.stringify(filterDto)} }...`);
        return await this.userService.getUsers(filterDto);
    }

    @Get('/:id')
    async getUserById(
        @Param('id', ParseIntPipe) id: number,
        @CheckUser() user: User
    ): Promise<GetUserDto> {
        this.logger.verbose(`User '${user.username}' requesting user data with ID '${id}'...`);
        return await this.userService.getUserById(id);
    }

    @Patch('/:id/role')
    async updateUserRole(
        @Param('id', ParseIntPipe) id: number,
        @Body('roleId', ParseIntPipe) roleId: number,
        @CheckUser() user: User
    ): Promise<GetUserDto> {
        this.logger.verbose(`User '${user.username}' updating users role with ID '${id}'...`);
        return await this.userService.updateUserRole(id, roleId, user);
    }

    @Patch('/reset')
    async resetPassword(
        @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
        @CheckUser() user: User
    ): Promise<void> {
        this.logger.verbose(`INFO: User "${user.username}" requested password reset...`);
        return await this.userService.resetPassword(resetPasswordDto, user);
    }

    @Delete()
    async deleteuser(
        @Body('id', ParseIntPipe) id: number,
        @CheckUser() user: User
    ): Promise<void> {
        this.logger.verbose(`User '${user.username}' deleting users data with ID '${id}'...`);
        return await this.userService.deleteUser(id, user);
    }
}