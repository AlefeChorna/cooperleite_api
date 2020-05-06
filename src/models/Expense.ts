import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('expenses')
class Expense {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  value: number;
}

export default Expense;
