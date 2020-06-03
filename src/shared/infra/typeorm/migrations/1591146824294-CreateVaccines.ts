import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateVaccines1591146824294 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'vaccines',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'company_id',
            type: 'uuid',
          },
          {
            name: 'operator_id',
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
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'vaccines',
      new TableForeignKey({
        name: 'fk_vaccines_to_users_key_company',
        columnNames: ['company_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'vaccines',
      new TableForeignKey({
        name: 'fk_vaccines_to_users_key_operator',
        columnNames: ['operator_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'vaccines',
      'fk_vaccines_to_users_key_company',
    );
    await queryRunner.dropForeignKey(
      'vaccines',
      'fk_vaccines_to_users_key_operator',
    );
    await queryRunner.dropTable('vaccines');
  }
}
