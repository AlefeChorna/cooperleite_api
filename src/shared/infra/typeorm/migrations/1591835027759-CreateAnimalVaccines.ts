import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAnimalVaccines1591835027759 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'animal_vaccines',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'vaccine_id',
            type: 'integer',
          },
          {
            name: 'animal_id',
            type: 'integer',
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
            name: 'lack_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'applied_at',
            type: 'timestamp',
            default: 'now()',
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
      'animal_vaccines',
      new TableForeignKey({
        name: 'fk_animal_vaccines_to_vaccines_key_vaccine',
        columnNames: ['vaccine_id'],
        referencedTableName: 'vaccines',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'animal_vaccines',
      new TableForeignKey({
        name: 'fk_animal_vaccines_to_animals_key_animal',
        columnNames: ['animal_id'],
        referencedTableName: 'animals',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'animal_vaccines',
      new TableForeignKey({
        name: 'fk_animal_vaccines_to_users_key_company',
        columnNames: ['company_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'animal_vaccines',
      new TableForeignKey({
        name: 'fk_animal_vaccines_to_users_key_operator',
        columnNames: ['operator_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'animal_vaccines',
      'fk_animal_vaccines_to_vaccines_key_vaccine',
    );
    await queryRunner.dropForeignKey(
      'animal_vaccines',
      'fk_animal_vaccines_to_animals_key_animal',
    );
    await queryRunner.dropForeignKey(
      'animal_vaccines',
      'fk_animal_vaccines_to_users_key_company',
    );
    await queryRunner.dropForeignKey(
      'animal_vaccines',
      'fk_animal_vaccines_to_users_key_operator',
    );

    await queryRunner.dropTable('animal_vaccines');
  }
}
