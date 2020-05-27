import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  Generated,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import Expense from '@modules/expenses/infra/typeorm/entities/Expense';
import uploadConfig from '@config/upload';

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

  @Column()
  @Generated('uuid')
  company_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Expense, (expense) => expense.user)
  @JoinColumn({ name: 'id' })
  expenses: Expense[];

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) return null;

    const { config } = uploadConfig;

    switch(uploadConfig.drive) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.avatar}`;
      case 'amazon_s3':
        return `https://${config.aws.bucket}.s3.amazonaws.com/${this.avatar}`;
      default:
        return null;
    }
  }
}

export default User;
