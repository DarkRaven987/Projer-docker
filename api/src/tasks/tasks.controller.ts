import { Controller, Get, Body, Post, Patch, Param, Delete, ParseIntPipe, Query, ValidationPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';
import { CreateTaskDto, UpdateTaskDto, GetTaskFilterDto, IGetTasks } from './dto/task.dto';
import { TaskStatusValidationPipe } from './pipe/tasksStatusValidation.pipe';
import { TasksStatus } from './tasks-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { CheckUser } from '../auth/dto/authCreds.dto';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(
        private tasksService: TasksService
    ){}

    @Get()
    async getTasks(
        @Query(ValidationPipe) filterDto: GetTaskFilterDto,
        @CheckUser() user: User,
    ): Promise<IGetTasks> {
        this.logger.verbose(`User '${user.username}' requesting all tasks list...`)
        return await this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    async getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @CheckUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User '${user.username}' requesting tasks by ID ${id}...`)
        return await this.tasksService.getTaskById(id, user)
    }

    @Post()
    async createTask(
        @Body() createTaskDto: CreateTaskDto,
        @CheckUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User '${user.username}' creating new task { ${JSON.stringify(createTaskDto)} }...`);
        return await this.tasksService.createTask(createTaskDto, user);
    }

    @Patch('/:id')
    async updateTaskInfo(
        @Body() updateTaskDto: UpdateTaskDto,
        @Param('id', ParseIntPipe) id: number,
        @CheckUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User '${user.username}' updating task by ID ${id} with info: ${JSON.stringify(updateTaskDto)}...`);
        return await this.tasksService.updateTaskInfo(id, updateTaskDto, user);
    }

    @Patch('/:id/status')
    async changeTaskStatus(
        @Body('status', TaskStatusValidationPipe) status: TasksStatus,
        @Param('id', ParseIntPipe) id: number,
        @CheckUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User '${user.username}' updating task by ID ${id} with status: ${JSON.stringify(status)}...`);
        return await this.tasksService.changeTaskStatus(id, status, user);
    }

    @Delete() 
    async deleteTask(
        @Body('id', ParseIntPipe) id: number,
        @CheckUser() user: User,
    ): Promise<void> {
        this.logger.verbose(`User '${user.username}' deleting task by ID ${id}...`);
        return await this.tasksService.deleteTask(id, user);
    }
}