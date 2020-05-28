import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from 'typeorm';

import IRuralPropertyModel from '@modules/rural-properties/models/IRuralPropertyModel';

@Entity('rural_properties')
class RuralProperties implements IRuralPropertyModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  @Generated('uuid')
  company_id: string;

  @Column()
  @Generated('uuid')
  operator_id: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}

export default RuralProperties
