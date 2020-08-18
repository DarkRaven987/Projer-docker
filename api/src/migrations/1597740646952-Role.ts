import { MigrationInterface, QueryRunner, getRepository, Table } from "typeorm";
import { User } from '../auth/user.entity';
import { Role } from '../roles/roles.entity';
import { roleSeeds } from '../seeds/role.seed';
import { userSeeds } from '../seeds/user.seed';

export class Role1597740646952 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'role',
              columns: [
                {
                  name: 'id',
                  type: 'int4',
                  isPrimary: true,
                  isGenerated: true,
                  generationStrategy: 'increment',
                },
                {
                  name: 'name',
                  type: 'varchar',
                  isNullable: false,
                },
                {
                  name: 'createdAt',
                  type: 'date',
                  isNullable: false,
                },
                {
                  name: 'updatedAt',
                  type: 'date',
                  isNullable: false,
                },
              ],
            }),
            false,
          );

        await queryRunner.createTable(
            new Table({
              name: 'user',
              columns: [
                {
                  name: 'id',
                  type: 'int4',
                  isPrimary: true,
                  isGenerated: true,
                  generationStrategy: 'increment',
                },
                {
                  name: 'firstName',
                  type: 'varchar',
                  isNullable: false,
                },
                {
                  name: 'secondName',
                  type: 'varchar',
                  isNullable: false,
                },
                {
                  name: 'roleId',
                  type: 'int4',
                  isNullable: false,
                },
                {
                  name: 'username',
                  type: 'varchar',
                  isNullable: false,
                },
                {
                  name: 'mail',
                  type: 'varchar',
                  isNullable: false,
                },
                {
                  name: 'password',
                  type: 'varchar',
                  isNullable: false,
                },
                {
                  name: 'salt',
                  type: 'varchar',
                  isNullable: false,
                },
                {
                  name: 'resetToken',
                  type: 'varchar',
                  isNullable: false,
                },
                {
                  name: 'resetExpireDate',
                  type: 'date',
                  isNullable: false,
                },
                {
                  name: 'createdAt',
                  type: 'date',
                  isNullable: false,
                },
                {
                  name: 'updatedAt',
                  type: 'date',
                  isNullable: false,
                },
              ],
            }),
            false,
          );

        await getRepository(Role).save(roleSeeds);
        await getRepository(User).save(userSeeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE role CASCADE');
    }

}
