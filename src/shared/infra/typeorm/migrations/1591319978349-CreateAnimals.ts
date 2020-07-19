import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAnimals1591319978349 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'animals',
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
            name: 'earring_number',
            type: 'decimal'
          },
          {
            name: 'breed',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'weight',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'varchar',
          },
          {
            name: 'lactating',
            type: 'boolean',
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
            name: 'date_birth',
            type: 'timestamp',
            isNullable: true,
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
      'animals',
      new TableForeignKey({
        name: 'fk_animals_to_users_key_company',
        columnNames: ['company_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'animals',
      new TableForeignKey({
        name: 'fk_animals_to_users_key_operator',
        columnNames: ['operator_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'animals',
      'fk_animals_to_users_key_company',
    );
    await queryRunner.dropForeignKey(
      'animals',
      'fk_animals_to_users_key_operator',
    );
    await queryRunner.dropTable('animals');
  }
}
