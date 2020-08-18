import { Module } from '@nestjs/common';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { ProjectRepository } from '../projects/projects.repository';
import { AuthModule } from '../auth/auth.module';
import { RoleRepository } from '../roles/roles.repository';
import { UserRepository } from '../auth/user.repository';
import { AppGateway } from '../app.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TasksRepository,
      ProjectRepository,
      RoleRepository,
      UserRepository
    ]),
    AuthModule
  ],
  controllers: [TasksController],
  providers: [TasksService, AppGateway]
})
export class TasksModule {}
