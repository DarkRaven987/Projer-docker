import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { PassportModule } from '@nestjs/passport';
import * as config from 'config';
import { JwtStrategy } from './jwt.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleRepository } from '../roles/roles.repository';
import { TasksRepository } from '../tasks/tasks.repository';
import { ProjectRepository } from '../projects/projects.repository';
import { AppGateway } from '../app.gateway';

const jwtConfig: any = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn
      }
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      RoleRepository,
      TasksRepository,
      ProjectRepository
    ])
  ],
  controllers: [
    AuthController,
    UserController
  ],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    AppGateway
  ],
  exports: [
    JwtStrategy,
    PassportModule
  ]
})
export class AuthModule {}
