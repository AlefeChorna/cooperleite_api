import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from 'typeorm';

import IVaccineModel from '@modules/vaccines/models/IVaccineModel';

@Entity('vaccines')
class Vaccine implements IVaccineModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

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

export default Vaccine
