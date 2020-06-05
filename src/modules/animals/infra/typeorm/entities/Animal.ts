import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from 'typeorm';

import IAnimalModel from '@modules/animals/models/IAnimalModel';

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

  @Column()
  earring_number: number;

  @Column()
  lactating: boolean;

  @Column()
  @Generated('uuid')
  company_id: string;

  @Column()
  @Generated('uuid')
  operator_id: string;

  @Column()
  date_birth: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}

export default Animal
