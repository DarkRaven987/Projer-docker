import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RoleRepository } from './roles.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleRepository]),
    AuthModule
  ],
  controllers: [RolesController],
  providers: [RolesService]
})
export class RolesModule {}
