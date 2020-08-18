import { Controller, Get, Body, Post, Patch, Delete, Param, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './roles.entity';
import { RoleDto } from './dto/role.dto';
import { AuthGuard } from '@nestjs/passport';
import { CheckUser } from '../auth/dto/authCreds.dto';
import { User } from '../auth/user.entity';

@Controller('roles')
@UseGuards(AuthGuard())
export class RolesController {
    constructor(
        private rolesService: RolesService
    ){}

    private logger = new Logger('RolesController');

    @Get()
    async getRoles(
        @CheckUser() user: User
    ): Promise<Array<Role>> {
        this.logger.verbose(`User '${user.username}' requesting all roles list...`);
        return this.rolesService.getRoles();
    }

    @Post()
    async createRole(
        @Body() createRoleDto: RoleDto,
        @CheckUser() user: User
    ): Promise<Role> {
        this.logger.verbose(`User '${user.username}' creating new role { ${JSON.stringify(createRoleDto)} }...`);
        return this.rolesService.createRole(createRoleDto);
    }

    @Patch('/:id')
    async updateRole(
        @Param('id', ParseIntPipe) id:number,
        @Body() updateRoleDto: RoleDto,
        @CheckUser() user: User
    ): Promise<Role> {
        this.logger.verbose(`User '${user.username}' updating role ID ${id} with data { ${JSON.stringify(updateRoleDto)} }  ...`);
        return this.rolesService.updateRole(id, updateRoleDto);
    }

    @Delete()
    async deleteRole(
        @Body('id', ParseIntPipe) id: number,
        @CheckUser() user: User
    ): Promise<void> {
        this.logger.verbose(`User '${user.username}' deleting role ID ${id}...`);
        return this.rolesService.deleteRole(id)
    }
}
