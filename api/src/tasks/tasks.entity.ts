import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { TasksStatus } from "./tasks-status.enum";
import { Project } from "../projects/projects.entity";
import { User } from "../auth/user.entity";

@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    codeName: string;

    @Column()
    description: string;
 
    @Column()
    status: TasksStatus;

    @Column()
    developerId: number;

    @Column()
    projectId: number;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @ManyToOne(type => Project, project => project.id)
    project: Project;

    @ManyToOne(type => User, user => user.id)
    user: User;
}