import { Injectable, NotFoundException, Logger, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { Task } from './tasks.entity';
import { CreateTaskDto, UpdateTaskDto, GetTaskFilterDto, IGetTasks } from './dto/task.dto';
import { ProjectRepository } from '../projects/projects.repository';
import { TasksStatus } from './tasks-status.enum';
import { RoleRepository } from '../roles/roles.repository';
import { UserRepository } from '../auth/user.repository';
import { AppGateway } from '../app.gateway';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
    private logger = new Logger('TasksService');
    constructor(
        @InjectRepository(TasksRepository)
        private tasksRepository: TasksRepository,
        @InjectRepository(ProjectRepository)
        private projectRepository: ProjectRepository,
        @InjectRepository(RoleRepository)
        private roleRepository: RoleRepository,
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private gateway: AppGateway
    ) {}

    async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<IGetTasks> {
        const loggedUserRole = await this.roleRepository.findOne({ id: user.roleId });
    
        if (loggedUserRole.name === 'User') {
          this.logger.error(
            `ERROR: User '${user.username}' is restricted to read this data.`,
          );
          throw new MethodNotAllowedException(
            `User '${user.username}' is restricted to read this data.`,
          );
        }

        return await this.tasksRepository.getTasks(filterDto);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const loggedUserRole = await this.roleRepository.findOne({ id: user.roleId });

        if (loggedUserRole.name === 'User') {
          this.logger.error(
            `ERROR: User '${user.username}' is restricted to read this data.`,
          );
          throw new MethodNotAllowedException(
            `User '${user.username}' is restricted to read this data.`,
          );
        }

        return await this.tasksRepository.getTaskById(id);
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const loggedUserRole = await this.roleRepository.findOne({ id: user.roleId });

        if (loggedUserRole.name === 'User') {
          this.logger.error(
              `ERROR: User '${user.username}' is restricted to create new data.`,
          );
          throw new MethodNotAllowedException(
              `User '${user.username}' is restricted to create new data.`,
          );
        }
        return await this.tasksRepository.createTask(createTaskDto, this.projectRepository, this.gateway);
    }

    async updateTaskInfo(
        id: number, 
        updateTaskDto: UpdateTaskDto,
        user: User
    ): Promise<Task> {
        const loggedUserRole = await this.roleRepository.findOne({ id: user.roleId });
    
        if (loggedUserRole.name === 'User') {
          this.logger.error(
            `ERROR: User '${user.username}' is restricted to update this data.`,
          );
          throw new MethodNotAllowedException(
            `User '${user.username}' is restricted to update this data.`,
          );
        }

        return await this.tasksRepository.updateTaskInfo(id, updateTaskDto, this.roleRepository, this.userRepository, this.gateway);
    };

    async changeTaskStatus(
        id: number, 
        status: TasksStatus,
        user: User
    ): Promise<Task> {
        const loggedUserRole = await this.roleRepository.findOne({ id: user.roleId });
    
        if (loggedUserRole.name === 'User') {
          this.logger.error(
            `ERROR: User '${user.username}' is restricted to update this data.`,
          );
          throw new MethodNotAllowedException(
            `User '${user.username}' is restricted to update this data.`,
          );
        }

        return await this.tasksRepository.changeTaskStatus(id, status, this.gateway);
    }

    async deleteTask(id: number, user: User): Promise<void> {
        const loggedUserRole = await this.roleRepository.findOne({ id: user.roleId });
    
        if (loggedUserRole.name === 'User') {
          this.logger.error(
            `ERROR: User '${user.username}' is restricted to delete this data.`,
          );
          throw new MethodNotAllowedException(
            `User '${user.username}' is restricted to delete this data.`,
          );
        }

        const result = await this.tasksRepository.delete({ id });
        if (result.affected === 0) {
            this.logger.error(`ERROR: Task with ID '${id}' was not found.`)
            throw new NotFoundException(`Task with ID '${id}' was not found.`);
        } else {
            this.logger.log(`SUCCESS: Task with ID '${id}' was deleted.`);
            this.gateway.wss.emit('TaskDeleted', {taskId: id});
        }
    }
}
