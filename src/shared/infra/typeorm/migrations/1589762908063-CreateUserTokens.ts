import {MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateUserTokens1589762908063 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'user_tokens',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'token',
          type: 'uuid',
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'last_token',
          type: 'uuid',
          isNullable: true
        },
        {
          name: 'user_id',
          type: 'uuid',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ]
    }));

    await queryRunner.createForeignKey(
      'user_tokens',
      new TableForeignKey({
        name: 'fk_user_tokens_to_users',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey('user_tokens', 'fk_user_tokens_to_users');
    await queryRunner.dropTable('user_tokens');
  }
}
