import { Injectable, Logger, MethodNotAllowedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { FilterUsersDto, GetUserDto, ResetPasswordDto, IGetUsers } from "./dto/authCreds.dto";
import { RoleRepository } from "../roles/roles.repository";
import { TasksRepository } from "../tasks/tasks.repository";
import { ProjectRepository } from "../projects/projects.repository";
import { User } from "./user.entity";
import { AppGateway } from "../app.gateway";

@Injectable()
export class UserService {
    private logger = new Logger('UsersService');
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @InjectRepository(RoleRepository)
        private roleRepository: RoleRepository,
        @InjectRepository(TasksRepository)
        private tasksRepository: TasksRepository,
        @InjectRepository(ProjectRepository)
        private projectRepository: ProjectRepository,
        private gateway: AppGateway
    ) {}

    async getUsers(filterDto: FilterUsersDto): Promise<IGetUsers> {
        return await this.userRepository.getUsers(filterDto, this.roleRepository)
    }

    async getUserById(id: number) {
        return await this.userRepository.getUserById(id, this.roleRepository);
    }

    async updateUserRole(id: number, roleId: number, user: User): Promise<GetUserDto> {
        const loggedUserRole = await this.roleRepository.findOne({ id: user.roleId });
    
        if (loggedUserRole.name !== 'Admin') {
          this.logger.error(
            `ERROR: User '${user.username}' is restricted to update this data.`,
          );
          throw new MethodNotAllowedException(
            `User '${user.username}' is restricted to update this data.`,
          );
        }

        return await this.userRepository.updateUserRole(id, roleId, this.roleRepository, user, this.gateway)
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto, user: User): Promise<void> {
        return await this.userRepository.resetPassword(resetPasswordDto, user);
    }

    async deleteUser(id: number, user: User): Promise<void> {
        const loggedUserRole = await this.roleRepository.findOne({ id: user.roleId });
    
        if (loggedUserRole.name !== 'Admin') {
          this.logger.error(
            `ERROR: User '${user.username}' is restricted to delete this data.`,
          );
          throw new MethodNotAllowedException(
            `User '${user.username}' is restricted to delete this data.`,
          );
        }

        return await this.userRepository.deleteUser(id, this.tasksRepository, this.projectRepository, this.roleRepository);
    }
}