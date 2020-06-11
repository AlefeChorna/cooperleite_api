import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from 'typeorm';

import IAnimalModel from '@modules/animals/models/IAnimalModel';
import ColumnNumericTransformer from '@shared/utils/number/ColumnNumericTransformer';

@Entity('animals')
class Animal implements IAnimalModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  breed: string;

  @Column()
  weight: number;

  @Column('integer', { transformer: new ColumnNumericTransformer() })
  earring_number: number;

  @Column()
  lactating: boolean;

  @Column()
  @Generated('uuid')
  company_id: string;

  @Column()
  @Generated('uuid')
  operator_id: string;

  @CreateDateColumn()
  date_birth: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}

export default Animal
