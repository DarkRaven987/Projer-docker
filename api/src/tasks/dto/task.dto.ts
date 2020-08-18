import { IsNotEmpty, IsOptional, IsIn } from "class-validator";
import { TasksStatus } from "../tasks-status.enum";
import { Task } from "../tasks.entity";

export class CreateTaskDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    projectId: number;
}

export class UpdateTaskDto {
    @IsOptional()
    title: string;

    @IsOptional()
    description: string;

    @IsOptional()
    developerId: number;
}

export class  GetTaskFilterDto {
    @IsOptional()
    @IsIn([TasksStatus.OPEN, TasksStatus.IN_PROGRESS, TasksStatus.TESTING, TasksStatus.DONE])
    status: TasksStatus

    @IsOptional()
    filter: string;

    @IsOptional()
    projectId: string;
    
    @IsOptional()
    developerId: string;

    @IsOptional()
    limit: number;

    @IsOptional()
    page: number;
}

export interface IGetTasks {
    tasks: Array<Task>;
    totalCount: number;
    pages: number;
}