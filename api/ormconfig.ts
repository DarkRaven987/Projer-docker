// import { TypeOrmModuleOptions } from "@nestjs/typeorm";
// import { Project } from "./src/projects/projects.entity";
// import { Role } from "./src/roles/roles.entity";
// import { User } from "./src/auth/user.entity";
// import { Task } from "./src/tasks/tasks.entity";
// import * as config from "config";

// const dbConfig: any = config.get('db');

// const typeOrmConfig: TypeOrmModuleOptions = {
//     type: dbConfig.type,
//     url: process.env.DATABASE_URL,
//     host: process.env.RDS_HOSTNAME || dbConfig.host,
//     port: process.env.PORT || dbConfig.port,
//     username: process.env.RDS_USERNAME ||dbConfig.username,
//     password: process.env.RDS_PASSWORD || dbConfig.password,
//     database: process.env.RDS_DB_NAME || dbConfig.database,
//     entities: [
//         Project,
//         Role,
//         User,
//         Task
//     ],
//     migrations: [
//       "./src/migrations/**.ts"
//     ],
//     synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
// }

// export = typeOrmConfig;