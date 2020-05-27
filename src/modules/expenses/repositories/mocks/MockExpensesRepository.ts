import { uuid } from 'uuidv4';

import IExpensesRepository from '@modules/expenses/repositories/IExpensesRepository';
import ICreateExpenseDTO from '@modules/expenses/dtos/ICreateExpenseDTO';
import Expense from '../../infra/typeorm/entities/Expense';

class MockExpensesRepository implements IExpensesRepository {
  private expensesRepository: Expense[] = [];

  public async create({
    name,
    value,
    company_id,
  }: ICreateExpenseDTO): Promise<Expense> {
    const expense = new Expense();

    Object.assign(expense, {
      id: uuid(),
      name,
      value,
      company_id
    });

    this.expensesRepository.push(expense);

    return expense;
  }
}

export default MockExpensesRepository;
