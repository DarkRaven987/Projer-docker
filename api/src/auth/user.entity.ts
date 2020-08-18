import { Entity, Unique, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Role } from "../roles/roles.entity";
import { Task } from "../tasks/tasks.entity";
import { Project } from "../projects/projects.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    secondName: string;

    @Column()
    roleId: number;

    @Column()
    username: string;

    @Column()
    mail: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column()
    resetToken: string ;

    @Column()
    resetExpireDate: Date;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @OneToMany(type => Task, task => task.id)
    task: Task;

    @OneToMany(type => Project, project => project.id)
    project: Project[];

    @ManyToOne(type => Role, role => role.id)
    role: Role;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

    async validateResetToken(token: string): Promise<{message: string, valid: boolean}> {
        const now = new Date();
        if (token !== this.resetToken) {
            return {
                message: 'Token is invalid!',
                valid: false
            }
        } else if (token == this.resetToken && now > this.resetExpireDate) {
            return {
                message: 'Token expired!',
                valid: false
            }
        } else if (token == this.resetToken && now < this.resetExpireDate) {
            return {
                message: 'Token is valid!',
                valid: true
            }
        }
    }
}