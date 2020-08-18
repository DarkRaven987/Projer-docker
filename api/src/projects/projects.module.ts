import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectRepository } from './projects.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../auth/user.repository';
import { AuthModule } from '../auth/auth.module';
import { RoleRepository } from '../roles/roles.repository';
import { TasksRepository } from '../tasks/tasks.repository';
import { AppGateway } from '../app.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectRepository,
      UserRepository, 
      RoleRepository,
      TasksRepository
    ]),
    AuthModule
  ],
  providers: [ProjectsService, AppGateway],
  controllers: [ProjectsController]
})
export class ProjectsModule {}
