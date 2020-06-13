import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import IAnimalVaccineModel from '@modules/animals/models/IAnimalVaccineModel';
import Animal from './Animal';

@Entity('animal_vaccines')
class AnimalVaccine implements IAnimalVaccineModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  vaccine_id: number;

  @Column()
  animal_id: number;

  @Column()
  @Generated('uuid')
  company_id: string;

  @Column()
  @Generated('uuid')
  operator_id: string;

  @CreateDateColumn()
  lack_at: string;

  @CreateDateColumn()
  applied_at: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @ManyToOne(() => Animal)
  @JoinColumn({ name: 'animal_id' })
  animal: Animal;
}

export default AnimalVaccine
