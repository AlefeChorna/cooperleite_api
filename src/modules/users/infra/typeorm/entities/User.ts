import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import Expense from '@modules/expenses/infra/typeorm/entities/Expense';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Expense, (expense) => expense.user)
  @JoinColumn({ name: 'id' })
  expenses: Expense[];

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string {
    return this.avatar
      ? `${process.env.APP_API_URL}/files/${this.avatar}`
      : this.avatar;
  }
}

export default User;
