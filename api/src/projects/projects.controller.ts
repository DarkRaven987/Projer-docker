import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, Query, ValidationPipe, UseGuards, Logger } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './projects.entity';
import { CreateProjectDto, GetProjectFilterDto, UpdateProjectDto, IGetProjects } from './dto/create-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { CheckUser } from '../auth/dto/authCreds.dto';

@Controller('projects')
@UseGuards(AuthGuard())
export class ProjectsController {
    private logger = new Logger('ProjectsController');
    constructor(private projectsService: ProjectsService){}

    @Get() 
    async getProjects(
        @Query(ValidationPipe) filterDto: GetProjectFilterDto,
        @CheckUser() user: User,
    ): Promise<IGetProjects> {
        this.logger.verbose(`User '${user.username}' requesting all projects list...`);
        return await this.projectsService.getProjects(filterDto, user);
    }

    @Get('/:id')
    async getProjectbyId(
        @Param('id', ParseIntPipe) id: number,
        @CheckUser() user: User,
    ): Promise<Project> {
        this.logger.verbose(`User '${user.username}' requesting tasks by ID ${id}...`);
        return await this.projectsService.getProjectById(id, user);
    }

    @Post()
    async initiateProject(
        @Body(ValidationPipe) createProjectDto: CreateProjectDto,
        @CheckUser() user: User,
    ): Promise<Project> {
        this.logger.verbose(`User '${user.username}' creating new project { ${JSON.stringify(createProjectDto)} }...`);
        return this.projectsService.initiateProject(createProjectDto, user);
    }

    @Patch('/:id')
    async updateProject(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) updateProjectDto: UpdateProjectDto,
        @CheckUser() user: User,
    ): Promise<Project> {
        this.logger.verbose(`User '${user.username}' updating project ID ${id} with DATA { ${JSON.stringify(updateProjectDto)} }...`);
        return this.projectsService.updateProject(id, updateProjectDto, user);
    }

    @Delete()
    async deleteProject(
        @Body('id', ParseIntPipe) id: number,
        @CheckUser() user: User,
    ): Promise<void> {
        this.logger.verbose(`User '${user.username}' deleting all project ID ${id}...`);
        return await this.projectsService.deleteProject(id, user)
    }
}
