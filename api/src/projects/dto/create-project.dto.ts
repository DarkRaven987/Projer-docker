import { IsNotEmpty, IsOptional, MinLength, MaxLength, IsString } from 'class-validator';
import { Project } from '../projects.entity';

export class CreateProjectDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(3)
    code: string;

    @IsNotEmpty()
    description: string;
}

export class UpdateProjectDto {
    @IsOptional()
    title: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(3)
    code: string;

    @IsOptional()
    description: string;

    @IsOptional()
    managerId: number;
}

export class GetProjectFilterDto {
    @IsOptional()
    filter: string;
    
    @IsOptional()
    limit: number;

    @IsOptional()
    page: number;
}

export interface IGetProjects {
    projects: Array<Project>,
    totalCount: number,
    pages: number
}