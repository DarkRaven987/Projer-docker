import { Injectable, NotFoundException, Logger, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectRepository } from './projects.repository';
import { Project } from './projects.entity';
import {
  CreateProjectDto,
  GetProjectFilterDto,
  UpdateProjectDto,
  IGetProjects,
} from './dto/create-project.dto';
import { UserRepository } from '../auth/user.repository';
import { RoleRepository } from '../roles/roles.repository';
import { TasksRepository } from '../tasks/tasks.repository';
import { AppGateway } from '../app.gateway';
import { User } from '../auth/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectRepository)
    private projectRepository: ProjectRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository,
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
    private gateway: AppGateway
  ) {}

  private logger = new Logger('ProjectsService');

  async getProjects(filterDto: GetProjectFilterDto, user: User): Promise<IGetProjects> {
    return await this.projectRepository.getProject(filterDto, user, this.roleRepository, this.tasksRepository);
  }

  async getProjectById(id: number, user: User): Promise<Project> {
    const loggedUserRole = await this.roleRepository.findOne({id: user.roleId});
    
    if (loggedUserRole.name === 'User') {
        this.logger.error(`ERROR: User '${user.username}' is restricted to read this data.`);
        throw new MethodNotAllowedException(`User '${user.username}' is restricted to read this data.`);
    }

    return await this.projectRepository.getProjectById(id);
  }

  async initiateProject(createProjectDto: CreateProjectDto, user: User): Promise<Project> {
    const loggedUserRole = await this.roleRepository.findOne({id: user.roleId});
        
    if (loggedUserRole.name === 'User' || loggedUserRole.name === 'Developer') {
        this.logger.error(`ERROR: User '${user.username}' is restricted to create new data.`);
        throw new MethodNotAllowedException(`User '${user.username}' is restricted to create new data.`);
    }

    return await this.projectRepository.initiateProject(createProjectDto, this.gateway);
  }

  async updateProject(
    id: number,
    updateProjectDto: UpdateProjectDto,
    user: User,
  ): Promise<Project> {
    const loggedUserRole = await this.roleRepository.findOne({id: user.roleId});
    
    if (loggedUserRole.name === 'User' || loggedUserRole.name === 'Developer') {
        this.logger.error(`ERROR: User '${user.username}' is restricted to create new data.`);
        throw new MethodNotAllowedException(`User '${user.username}' is restricted to create new data.`);
    }

    return this.projectRepository.updateProject(
      id,
      updateProjectDto,
      this.userRepository,
      this.roleRepository,
      this.tasksRepository,
      this.gateway
    );
  }

  async deleteProject(id: number, user: User): Promise<void> {
    const loggedUserRole = await this.roleRepository.findOne({id: user.roleId});
    
    if (loggedUserRole.name === 'User' || loggedUserRole.name === 'Developer') {
        this.logger.error(`ERROR: User '${user.username}' is restricted to delete this data.`);
        throw new MethodNotAllowedException(`User '${user.username}' is restricted to delete this data.`);
    }

    const found = await this.projectRepository.findOne({ id });

    if (!found) {
      this.logger.error(`ERROR: Project with ID '${id}' was not found.`);
      throw new NotFoundException(`Project with ID '${id}' was not found.`);
    } else {
      await this.tasksRepository.delete({ projectId: id });
      await this.projectRepository.delete(id);
      this.logger.log(`SUCCESS: Project with ID '${id}' was deleted.`);
      this.gateway.wss.emit('ProjectDeleted', {projectId: id});
    }
  }
}
