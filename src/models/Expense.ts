import { uuid } from 'uuidv4';

class Expense {
  id: string;

  name: string;

  value: number;

  constructor({ name, value }: Omit<Expense, 'id'>) {
    this.id = uuid();
    this.name = name;
    this.value = value;
  }
}

export default Expense;
