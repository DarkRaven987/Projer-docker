import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Unique, OneToMany, ManyToOne } from "typeorm";
import { IsOptional } from "class-validator";
import { Task } from "../tasks/tasks.entity";
import { User } from "../auth/user.entity";

@Entity()
@Unique(['title', 'code'])
export class Project extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    code: string;

    @Column()
    taskCounter: number;

    @Column()
    @IsOptional()
    managerId: number;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @OneToMany(type => Task, task => task.id)
    task: Task[];

    @ManyToOne(type => User, user => user.id)
    user: User;
}