import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateRuralProperties1590621873717 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'rural_properties',
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
            name: 'city',
            type: 'varchar',
          },
          {
            name: 'state',
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
      'rural_properties',
      new TableForeignKey({
        name: 'fk_rural_properties_to_users_key_company',
        columnNames: ['company_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'rural_properties',
      new TableForeignKey({
        name: 'fk_rural_properties_to_users_key_operator',
        columnNames: ['operator_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'rural_properties',
      'fk_rural_properties_to_users_key_company',
    );
    await queryRunner.dropForeignKey(
      'rural_properties',
      'fk_rural_properties_to_users_key_operator',
    );
    await queryRunner.dropTable('rural_properties');
  }
}
