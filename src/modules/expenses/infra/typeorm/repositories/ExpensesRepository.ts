import { getRepository, Repository } from 'typeorm';

import IExpensesRepository from '@modules/expenses/repositories/IExpensesRepository';
import ICreateExpenseDTO from '@modules/expenses/dtos/ICreateExpenseDTO';
import Expense from '../entities/Expense';

class ExpensesRepository implements IExpensesRepository {
  private ormRepository: Repository<Expense>;

  constructor() {
    this.ormRepository = getRepository(Expense);
  }

  public async create({
    name,
    value,
    company_id,
  }: ICreateExpenseDTO): Promise<Expense> {
    const expense = this.ormRepository.create({ name, value, company_id });

    await this.ormRepository.save(expense);

    return expense;
  }
}

export default ExpensesRepository;
