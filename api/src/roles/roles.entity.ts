import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from "typeorm";
import { User } from "../auth/user.entity";

@Entity()
@Unique(['name'])
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    createdAt: Date;
    
    @Column()
    updatedAt: Date;

    @OneToMany(type => User, user => user.role)
    user: User[];
}