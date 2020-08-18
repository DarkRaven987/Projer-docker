import { Repository, EntityRepository, Like } from 'typeorm';
import { Task } from './tasks.entity';
import {
  NotFoundException,
  InternalServerErrorException,
  Logger,
  BadRequestException,
  MethodNotAllowedException,
} from '@nestjs/common';
import {
  CreateTaskDto,
  UpdateTaskDto,
  GetTaskFilterDto,
  IGetTasks,
} from './dto/task.dto';
import { TasksStatus } from './tasks-status.enum';
import { ProjectRepository } from '../projects/projects.repository';
import { RoleRepository } from '../roles/roles.repository';
import { UserRepository } from '../auth/user.repository';
import { AppGateway } from '../app.gateway';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository');

  async getTasks(
    filterDto: GetTaskFilterDto,
  ): Promise<IGetTasks> {
    const { status, filter, projectId, developerId, limit, page } = filterDto;
    const condition: any = {};
    let where: any = [];
    const take = limit || 10;
    const skip = page > 0 ? limit * (page - 1) : 0;

    if (status) {
      condition.status = status;
    }

    if (projectId) {
      condition.projectId = projectId;
    }

    if (developerId) {
      condition.developerId = developerId;
    }

    if (filter) {
      where = [
        {
          title: Like(`%${filter}%`),
          ...condition,
        },
        {
          description: Like(`%${filter}%`),
          ...condition,
        },
        {
          codeName: Like(`%${filter}%`),
          ...condition,
        },
      ];
    } else {
      where = {
        ...condition,
      };
    }

    const tasks = await this.findAndCount({
      where,
      order: { id: 'ASC' },
      take,
      skip,
    });

    this.logger.log('SUCCESS: All tasks data was received.');
    return {
      tasks: tasks[0],
      totalCount: tasks[1],
      pages: Math.ceil(tasks[1] / take),
    };
  }

  async getTaskById(
    id: number
  ): Promise<Task> {
    const task = await this.findOne({ where: { id } });

    if (!task) {
      this.logger.error(`ERROR: Task with ID '${id}' was not found.`);
      throw new NotFoundException();
    }

    this.logger.log(`SUCCESS: Task data with ID '${id}' was received.`);
    return task;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    projectRepository: ProjectRepository,
    gateway: AppGateway
  ): Promise<Task> {
    const { title, description, projectId } = createTaskDto;

    const foundProject = await projectRepository.findOne({
      where: { id: projectId },
    });

    if (!foundProject) {
      this.logger.error(`ERROR: Project with ID '${projectId}' was not found.`);
      throw new NotFoundException(
        `Project with ID '${projectId}' was not found`,
      );
    }

    foundProject.taskCounter += 1;
    foundProject.updatedAt = new Date();
    foundProject.save();

    const task = new Task();
    task.title = title;
    task.codeName = `${foundProject.code}-${foundProject.taskCounter}`;
    task.description = description;
    task.projectId = projectId;
    task.status = TasksStatus.OPEN;
    task.developerId = 0;
    task.createdAt = new Date();
    task.updatedAt = new Date();

    try {
      this.logger.log(`SUCCESS: Created new task data.`);
      await task.save();
    } catch (error) {
      this.logger.error(`ERROR: ${error}`);
      throw new InternalServerErrorException(error);
    }
    gateway.wss.emit('TaskCreated', task);
    return task;
  }

  async updateTaskInfo(
    id: number,
    updateTaskDto: UpdateTaskDto,
    roleRepository: RoleRepository,
    userRepository: UserRepository,
    gateway: AppGateway,
  ): Promise<Task> {
    const { title, description, developerId } = updateTaskDto;

    const task = await this.findOne({ where: { id } });

    if (!task) {
      this.logger.error(`ERROR: Task with ID '${id}' was not found.`);
      throw new NotFoundException(`Task with ID '${id}' was not found.`);
    }

    if (title) {
      task.title = title;
    }

    if (description) {
      task.description = description;
    }

    if (developerId) {
      const user = await userRepository.findOne({ where: { id: developerId } });

      if (user) {
        const role = await roleRepository.findOne({
          where: { id: user.roleId },
        });

        if (role.name === 'Developer') {
          task.developerId = developerId;
        } else {
          this.logger.error('ERROR: This user cannot be assigned to task.');
          throw new BadRequestException();
        }
      } else {
        this.logger.error('ERROR: User was not found.');
        throw new BadRequestException();
      }
    }

    if (title || description || developerId) {
      task.updatedAt = new Date();
    }

    try {
      await task.save();
      this.logger.log(`SUCCESS: Task with ID '${id}' was updated.`);
    } catch (error) {
      this.logger.error(`ERROR: ${error}`);
      throw new InternalServerErrorException(error);
    }
    gateway.wss.emit('TaskUpdated', task);
    return task;
  }

  async changeTaskStatus(
    id: number,
    status: TasksStatus,
    gateway: AppGateway
  ): Promise<Task> {
    const task = await this.findOne({ where: { id } });

    if (!task) {
      this.logger.error(`ERROR: Task with ID '${id}' was not found.`);
      throw new NotFoundException(`Task with ID '${id}' was not found.`);
    }
    if (!status) {
      this.logger.error(`ERROR: Lack of query data.`);
      throw new NotFoundException(`Lack of query data.`);
    }

    task.status = TasksStatus[status];
    task.updatedAt = new Date();

    try {
      await task.save();
      this.logger.log(`SUCCESS: Task with ID '${id}' has status changed.`);
    } catch (error) {
      this.logger.error(`ERROR: ${error}`);
      throw new InternalServerErrorException(error);
    }
    gateway.wss.emit('TaskStatusUpdated', task);
    return task;
  }
}
