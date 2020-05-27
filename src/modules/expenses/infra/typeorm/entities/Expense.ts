import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

@Entity('expenses')
class Expense {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  value: number;

  @Column()
  company_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'company_id' })
  user: User;
}

export default Expense;
