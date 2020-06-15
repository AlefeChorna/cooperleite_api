import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAnimalFeed1592089864107 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'animal_feed',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'quantity',
            type: 'decimal',
          },
          {
            name: 'product_id',
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
      'animal_feed',
      new TableForeignKey({
        name: 'fk_animal_feed_to_products_key_product',
        columnNames: ['product_id'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'animal_feed',
      new TableForeignKey({
        name: 'fk_animal_feed_to_animals_key_animal',
        columnNames: ['animal_id'],
        referencedTableName: 'animals',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'animal_feed',
      new TableForeignKey({
        name: 'fk_animal_feed_to_users_key_company',
        columnNames: ['company_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'animal_feed',
      new TableForeignKey({
        name: 'fk_animal_feed_to_users_key_operator',
        columnNames: ['operator_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'animal_feed',
      'fk_animal_feed_to_products_key_product',
    );
    await queryRunner.dropForeignKey(
      'animal_feed',
      'fk_animal_feed_to_animals_key_animal',
    );
    await queryRunner.dropForeignKey(
      'animal_feed',
      'fk_animal_feed_to_users_key_company',
    );
    await queryRunner.dropForeignKey(
      'animal_feed',
      'fk_animal_feed_to_users_key_operator',
    );

    await queryRunner.dropTable('animal_feed');
  }
}
