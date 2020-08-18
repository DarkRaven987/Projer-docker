import { EntityRepository, Repository, Like } from 'typeorm';
import { User } from './user.entity';
import {
  SignUpDto,
  SignInDto,
  GetUserDto,
  FilterUsersDto,
  UpdateForgotPassword,
  ResetPasswordDto,
  IGetUsers,
  RequestForgotPassword,
  ValidateToken,
} from './dto/authCreds.dto';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  Logger,
  MethodNotAllowedException,
  UnauthorizedException,
  NotAcceptableException,
} from '@nestjs/common';
import * as config from 'config';

import transport from '../static/email-transport';
import { RoleRepository } from '../roles/roles.repository';
import { ProjectRepository } from '../projects/projects.repository';
import { TasksRepository } from '../tasks/tasks.repository';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../roles/roles.entity';
import { JwtPayload } from './jwt-payload.interface';
import { AppGateway } from '../app.gateway';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  async signUp(
    authCredsDto: SignUpDto,
    roleRepository: RoleRepository,
    gateway: AppGateway,
  ): Promise<void> {
    const { firstName, secondName, username, mail, password } = authCredsDto;
    const isMailExist = await this.findOne({mail});
    console.log('isMailExist', isMailExist)
    console.log('mail', mail)
    if (isMailExist) {
      this.logger.error(`ERROR: User with such email already exists.`)
      throw new ConflictException(`User with such email already exists.`);
    }

    const salt = await bcrypt.genSalt();
    const userRole = await roleRepository.findOne({ where: { name: 'User' } });

    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create();
    user.firstName = firstName;
    user.secondName = secondName;
    user.username = username;
    user.mail = mail;
    user.resetToken = 'null';
    user.password = hashedPassword;
    user.roleId = userRole.id;
    user.salt = salt;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.resetExpireDate = new Date();

    try {
      await user.save();
      const result: GetUserDto = {
        id: user.id,
        firstName: user.firstName,
        secondName: user.secondName,
        role: userRole.name,
        username: user.username,
        mail: user.mail,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      gateway.wss.emit('UserSignedUp', result);

      const options = {
        from: 'projer.test@gmail.com',
        to: user.mail,
        subject: 'Registration on Projer!',
        text: 'Welcome to Projer community!',
      };

      transport.sendMail(options, (err) => {
        if (err) {
          console.log(err);
          this.logger.error('ERROR: Registration message sending error...');
        } else {
          this.logger.log('Registration message sent.');
        }
      });

      this.logger.log('SUCCESS: Registration completed.');
    } catch (error) {
      this.logger.error(`ERROR: ${error}`);
      if (error.code == 23505) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async signIn(
    authCredsDto: SignInDto,
    userRepository: UserRepository,
    roleRepository: RoleRepository,
    jwtService: JwtService,
  ): Promise<{ accessToken: string; user: GetUserDto }> {
    const username = await userRepository.validateUserPassword(authCredsDto);

    if (!username) {
      this.logger.error('ERROR: invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }

    const user: User = await userRepository.findOne({ where: { username } });
    const userRole: Role = await roleRepository.findOne({
      where: { id: user.roleId },
    });
    const userData: GetUserDto = {
      id: user.id,
      firstName: user.firstName,
      secondName: user.secondName,
      role: userRole.name,
      username: user.username,
      mail: user.mail,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    delete user.password;
    delete user.salt;

    const payload: JwtPayload = { username };
    const accessToken = await jwtService.sign(payload);
    this.logger.log('SUCCESS: Authentification complete.');

    return {
      accessToken,
      user: userData,
    };
  }

  async validateUserPassword(authCredsDto: SignInDto): Promise<string> {
    const { username, password } = authCredsDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return username;
    }
    return null;
  }

  async forgotPasswordRequest(
    forgotPasswordReqDto: RequestForgotPassword,
  ): Promise<void> {
    const { mail } = forgotPasswordReqDto;
    const serverConfig: any = config.get('server');
    const user: User = await this.findOne({ mail });

    if (!user) {
      this.logger.error(`ERROR: No username with "${mail}" email!`);
      throw new NotFoundException(`No username with such email found!`);
    }

    const expireDate = new Date(new Date().getTime() + 5 * 60000);
    const hashedToken = await bcrypt.hash(
      `${user.mail}${expireDate}`,
      user.salt,
    );

    user.resetToken = hashedToken;
    user.resetExpireDate = expireDate;

    try {
      user.save();

      const options = {
        from: 'projer.test@gmail.com',
        to: user.mail,
        subject: 'Password reset request',
        html: `<!DOCTYPE html>
          <html lang="ru">
            <head> <meta charset="UTF-8"> <title>Title</title></head>
            <body>
              <h1>Greetings!</h1> 
              <p>
                We got a request from youto reset your forgotten password. 
                Click the link below to reset your password.
              </p>
              <p>
                <a href='${process.env.ORIGIN ||
                  serverConfig.origin}/forgot?token=${hashedToken}&email=${mail}'>
                  Reset password
                </a>
              </p>
            </body>
          </html>`,
      };

      transport.sendMail(options, (err) => {
        if (err) {
          console.log(err);
          this.logger.error('Password reset message sending error...');
        } else {
          this.logger.log('Password reset message sent.');
        }
      });

      this.logger.log('SUCCESS: Created password reset token.');
    } catch (error) {
      this.logger.error(`ERROR: Couldn't save resetToken data.`);
      throw new InternalServerErrorException();
    }
  }

  async validateResetToken(
    validateTokenDto: ValidateToken,
  ): Promise<{ message: string; valid: boolean }> {
    const { token, mail } = validateTokenDto;
    const user = await this.findOne({ mail });

    if (user) {
      return await user.validateResetToken(token);
    }
    return {
      message: 'ERROR: User not found...',
      valid: false,
    };
  }

  async forgotPassword(
    forgotPasswordDto: UpdateForgotPassword,
    userRepository: UserRepository,
  ) {
    const { mail, password, token } = forgotPasswordDto;
    const foundUser: User = await userRepository.findOne({ mail });

    if (!foundUser) {
      this.logger.error(`ERROR: There is no user with email "${mail}"`);
      throw new NotFoundException(`There is no user with email "${mail}"`);
    }

    const checkTokenValid = await this.validateResetToken({token, mail});

    if (checkTokenValid.valid) {
      const hashedPassword = await bcrypt.hash(password, foundUser.salt);
      foundUser.password = hashedPassword;
    } else {
      this.logger.error(`ERROR: ${checkTokenValid.message}`);
      throw new NotAcceptableException(checkTokenValid.message);
    }    

    try {
      await foundUser.save();
      this.logger.log(
        `SUCCESS: User with email "${mail}"s has password updated.`,
      );
    } catch (error) {
      this.logger.error(`ERROR: Couldn't save new password.`);
      throw new InternalServerErrorException();
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    user: User,
  ): Promise<void> {
    const { newPassword } = resetPasswordDto;
    const foundUser: User = await this.findOne({ id: user.id });

    const hashedPassword = await bcrypt.hash(newPassword, foundUser.salt);

    foundUser.password = hashedPassword;

    try {
      foundUser.save();
      this.logger.log(`SUCCESS: "${foundUser.username}" has password updated.`);
    } catch (error) {
      this.logger.error(`ERROR: Couldn't save new password.`);
      throw new InternalServerErrorException();
    }
  }

  async getUsers(
    filterDto: FilterUsersDto,
    roleRepository: RoleRepository,
  ): Promise<IGetUsers> {
    const { filter, role, limit, page } = filterDto;
    const take = limit || 10;
    const skip = page > 0 ? limit * (page - 1) : 0;
    const roles = await roleRepository.find();
    const condition: any = {};
    let where: any = [];

    if (role) {
      condition.roleId = role;
    }

    if (filter) {
      where = [
        {
          firstName: Like(`%${filter}%`),
          ...condition,
        },
        {
          secondName: Like(`%${filter}%`),
          ...condition,
        },
        {
          username: Like(`%${filter}%`),
          ...condition,
        },
      ];
    } else {
      where = {
        ...condition,
      };
    }

    const result = await this.findAndCount({
      where,
      order: { id: 'ASC' },
      take,
      skip,
    });

    const outputUsers: Array<GetUserDto> = result[0].map(user => ({
      id: user.id,
      firstName: user.firstName,
      secondName: user.secondName,
      role: roles.find(role => role.id === user.roleId).name,
      username: user.username,
      mail: user.mail,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    this.logger.log(`SUCCESS: Users data was received.`);
    return {
      users: outputUsers,
      totalCount: result[1],
      pages: Math.ceil(result[1] / take),
    };
  }

  async getUserById(id: number, roleRepository: RoleRepository) {
    const found = await this.findOne({ id });
    const role = await roleRepository.findOne({ where: { id: found.roleId } });

    if (!found) {
      this.logger.error(`ERROR: User with ID ${id} was not found.`);
      throw new NotFoundException();
    }

    const user: GetUserDto = {
      id: found.id,
      firstName: found.firstName,
      secondName: found.secondName,
      role: role.name,
      username: found.username,
      mail: found.mail,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
    };

    this.logger.log(`SUCCESS: User data with ID ${id} was received.`);
    return user;
  }

  async updateUserRole(
    id: number,
    roleId: number,
    roleRepository: RoleRepository,
    logUser: User,
    gateway: AppGateway,
  ): Promise<GetUserDto> {
    const isAdminRole = await roleRepository.findOne({
      where: { id: logUser.roleId },
    });
    let role;

    if (isAdminRole.name === 'Admin') {
      const user = await this.findOne(id);
      role = await roleRepository.findOne({ where: { id: roleId } });
      if (user && role) {
        user.roleId = role.id;
        user.updatedAt = new Date();
      } else {
        this.logger.error('ERROR: Invalid data');
        throw new BadRequestException();
      }

      const outputUser: GetUserDto = {
        id: user.id,
        firstName: user.firstName,
        secondName: user.secondName,
        role: role.name,
        username: user.username,
        mail: user.mail,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      try {
        await user.save();
        const result: GetUserDto = {
          id: user.id,
          firstName: user.firstName,
          secondName: user.secondName,
          role: role.name,
          username: user.username,
          mail: user.mail,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
        gateway.wss.emit('UserUpdated', result);
        this.logger.log(`SUCCESS: User with ID ${id} has status updated.`);
      } catch (error) {
        this.logger.error(`ERROR: Users status with ID ${id} was not updated.`);
        throw new InternalServerErrorException();
      }

      return outputUser;
    } else {
      this.logger.error(`ERROR: Permission denied.`);
      throw new MethodNotAllowedException();
    }
  }

  async deleteUser(
    id: number,
    tasksRepository: TasksRepository,
    projectRepository: ProjectRepository,
    roleRepository: RoleRepository,
  ) {
    const user = await this.findOne(id);
    const role = await roleRepository.findOne(user.roleId);

    const result = await this.delete({ id });

    if (result.affected === 0) {
      this.logger.error(`ERROR: User with ID '${id}' was not found.`);
      throw new NotFoundException(`User with ID '${id}' was not found.`);
    } else {
      if (role.name === 'Developer') {
        const tasks = await tasksRepository.find({
          where: { developerId: id },
        });

        if (tasks && tasks.length) {
          tasks.map(async task => {
            task.developerId = 0;
            task.updatedAt = new Date();
            await task.save();
          });
        }
      } else if (role.name === 'Manager') {
        const projects = await projectRepository.find({
          where: { managerId: id },
        });

        if (projects && projects.length) {
          projects.map(async project => {
            project.managerId = 0;
            project.updatedAt = new Date();
            await project.save();
          });
        }
      }
      this.logger.log(`SUCCESS: User with ID '${id}' was deleted.`);
    }
  }
}
