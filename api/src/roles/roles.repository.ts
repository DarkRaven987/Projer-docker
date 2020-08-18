import { EntityRepository, Repository } from "typeorm";
import { Role } from "./roles.entity";
import { RoleDto } from "./dto/role.dto";
import { NotFoundException, Logger, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
    private logger = new Logger('RolesRepository');

    async getRoles(): Promise<Array<Role>> {
        const result = this.find();
        this.logger.log('SUCCESS: Roles list was received.');        
        return result;
    }

    async createRole(createRoleDto: RoleDto): Promise<Role> {
        const { name } = createRoleDto;
        const role = new Role();
        role.name = name;
        role.createdAt = new Date();
        role.updatedAt = new Date();
        try {
            this.logger.log('SUCCESS: New role was created.');
            await role.save();
        } catch(error) {
            this.logger.error('ERROR:' + error);
            throw new InternalServerErrorException(error);
        }
        return role;
    }

    async updateRole(
        id: number, 
        updateRoleDto: RoleDto
    ): Promise<Role> {
        const { name } = updateRoleDto;
        const role = await this.findOne(id)
        
        if (role) {
            role.name = name;
            role.updatedAt = new Date();
        } else {
            this.logger.error(`ERROR: No role with ID ${id} was found!`);
            throw new NotFoundException(`No role with ID ${id} was found!`);
        }

        try {
            this.logger.log(`SUCCESS: Role with ID ${id} was updated.`);
            await role.save();
        } catch(error) {
            this.logger.error('ERROR:' + error);
            throw new InternalServerErrorException(error);
        }
        
        return role;
    }
}