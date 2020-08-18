import { EntityRepository, Repository, Like, In } from "typeorm";
import { Project } from "./projects.entity";
import { CreateProjectDto, GetProjectFilterDto, UpdateProjectDto, IGetProjects } from "./dto/create-project.dto";
import { NotFoundException, InternalServerErrorException, Logger, MethodNotAllowedException } from "@nestjs/common";
import { UserRepository } from "../auth/user.repository";
import { RoleRepository } from "../roles/roles.repository";
import { TasksRepository } from "../tasks/tasks.repository";
import { Task } from "../tasks/tasks.entity";
import { AppGateway } from "../app.gateway";
import { User } from "../auth/user.entity";

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
    private logger = new Logger('ProjectsRepository');
    
    async getProject(
        filterDto: GetProjectFilterDto,
        user: User,
        rolesRepository: RoleRepository,
        tasksRepository: TasksRepository,
    ): Promise<IGetProjects> {
        const {
            filter,
            limit, 
            page
        } = filterDto;
        const condition: any = {};
        let where: any = [];
        const take = limit || 10;
        const skip = page > 0 ? limit * ( page - 1 ) : 0;
        const loggedUserRole = await rolesRepository.findOne({id: user.roleId});
        let nullRes = null;

        if (loggedUserRole.name === 'Developer') {
            const relatedTasks = await tasksRepository.find({developerId: user.id});

            if (relatedTasks.length) {
                condition.id = In(relatedTasks.map(task => task.projectId));
            } else {
                nullRes = [];
            } 
        } else if (loggedUserRole.name === 'Manager') {
            condition.managerId = user.id
        } else if (loggedUserRole.name === 'User') {
            this.logger.error(`ERROR: User '${user.username}' is restricted to read this data.`);
            throw new MethodNotAllowedException(`User '${user.username}' is restricted to read this data.`);
        }

        if (filter) {
            where = [{
                title: Like(`%${filter}%`),
                ...condition,
            }, {
                description: Like(`%${filter}%`),
                ...condition,
            }, {
                code: Like(`%${filter}%`),
                ...condition,
            }]
        } else {
            where = {
                ...condition,
            }
        }

        const result = (loggedUserRole.name === 'Developer' && nullRes !== null && !nullRes.length) 
            ? [nullRes, 0] 
            : await this.findAndCount({
                where, 
                order: {id: 'ASC'},
                take,
                skip
            }); 

        this.logger.log('SUCCESS: All projects data was received.')
        return {
            projects: result[0],
            totalCount: result[1],
            pages: Math.ceil(result[1]/take)
        };
    }

    async getProjectById(id: number): Promise<Project> {
        const result = await this.findOne(id);

        if (!result) {
            throw new NotFoundException;
        }

        return result;
    }

    async initiateProject(createProjectDto: CreateProjectDto, gateway: AppGateway): Promise<Project> {
        const { title, code, description } = createProjectDto;
        const project = new Project();

        project.title = title;
        project.description = description;
        project.code = code;
        project.taskCounter = 0;
        project.managerId=0;
        project.createdAt = new Date();
        project.updatedAt = new Date();

        try {
            await project.save();
        } catch(error) {
            throw(new Error(error));
        }
        gateway.wss.emit('ProjectCreated', project);
        return project;
    }

    async updateProject(
        id: number,
        updateProjectDto: UpdateProjectDto,
        userRepository: UserRepository,
        roleRepository: RoleRepository,
        tasksRepository: TasksRepository,
        gateway: AppGateway
    ): Promise<Project> {
        
        const {
            title,
            description,
            code,
            managerId
        } = updateProjectDto;

        const project = await this.findOne(id);

        if (!project) {
            this.logger.error(`ERROR: Project with ID '${id}' was not found.`);
            throw new NotFoundException(`Project with ID '${id}' was not found.`)
        }

        if (title) {
            project.title = title;
            project.updatedAt = new Date();
        }

        if (description) {
            project.description = description;
            project.updatedAt = new Date();
        }

        if (code) {
            project.code = code;
            project.updatedAt = new Date();
            
            const tasks: Array<Task> = await tasksRepository.find({where: {projectId: project.id}});
            tasks.map(task => {
                task.codeName = task.codeName.replace(/([A-Z]*)(\-[1-9]*)/i, `${code}$2`);
                task.save();
            });
        }

        if (managerId) {
            const foundUser = await userRepository.findOne({where: { id: managerId }});

            if (!foundUser) {
                this.logger.error(`ERROR: User with ID '${managerId}' was not found.`);
                throw new NotFoundException(`User with ID '${managerId}' was not found.`)
            }
            const managerRole = await roleRepository.findOne({ where: {name: 'Manager'} });

            if (foundUser.roleId === managerRole.id) {
                project.managerId = managerId;
                project.updatedAt = new Date();
            } else {
                this.logger.error(`ERROR: User with ID '${managerId}' is not MANAGER`);
                throw new NotFoundException(`User with ID '${managerId}' is not MANAGER`);
            }
        }

        try {
            await project.save();
            this.logger.log(`SUCCESS: Project with ID '${id}' was updated.`);
        } catch (error) {
            throw new InternalServerErrorException();
        }
        gateway.wss.emit('ProjectUpdated', project);
        return project;
    }

}