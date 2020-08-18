import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from './roles.repository';
import { RoleDto } from './dto/role.dto';
import { Role } from './roles.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(RoleRepository)
        private roleRepository: RoleRepository
    ) {}

    private logger = new Logger('RolesService');

    async getRoles(): Promise<Array<Role>> {
        return this.roleRepository.getRoles();
    }

    async createRole(createRoleDto: RoleDto): Promise<Role> {
       return this.roleRepository.createRole(createRoleDto); 
    }

    async updateRole(
        id: number, 
        updateRoleDto: RoleDto
    ): Promise<Role> {
        return this.roleRepository.updateRole(id, updateRoleDto);
    }

    async deleteRole(id: number): Promise<void> {
        const result = await this.roleRepository.delete({ id })
        if (result.affected === 0) {
            this.logger.error(`ERROR: Role with ID '${id}' was not found.`)
            throw new NotFoundException(`Role with ID '${id}' was not found`);
        } else {
            this.logger.log(`SUCCESS: Role with ID '${id}' was deleted.`)
        }
    }
}
