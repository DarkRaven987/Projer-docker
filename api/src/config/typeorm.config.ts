import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Project } from "../projects/projects.entity";
import { Role } from "../roles/roles.entity";
import { User } from "../auth/user.entity";
import { Task } from "../tasks/tasks.entity";
import * as config from "config";

const dbConfig: any = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    url: process.env.DATABASE_URL,
    host: process.env.RDS_HOSTNAME || dbConfig.host,
    port: process.env.PORT || dbConfig.port,
    username: process.env.RDS_USERNAME ||dbConfig.username,
    password: process.env.RDS_PASSWORD || dbConfig.password,
    database: process.env.RDS_DB_NAME || dbConfig.database,
    entities: [
        Project,
        Role,
        User,
        Task
    ],
    synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
}