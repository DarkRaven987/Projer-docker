import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ProjectsModule,
    RolesModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
