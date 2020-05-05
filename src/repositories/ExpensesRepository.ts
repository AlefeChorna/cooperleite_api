import Expense from '../models/Expense';

interface CreateExpenseDTO {
  name: string;
  value: number;
}

class ExpensesRepository {
  private expenses: Expense[];

  constructor() {
    this.expenses = [];
  }

  public all(): Expense[] {
    return this.expenses;
  }

  public create({ name, value }: CreateExpenseDTO): Expense {
    const expense = new Expense({ name, value });
    this.expenses.push(expense);

    return expense;
  }
}

export default ExpensesRepository;
