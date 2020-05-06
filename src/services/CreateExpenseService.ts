import { getCustomRepository } from 'typeorm';

import Expense from '../models/Expense';
import ExpensesRepository from '../repositories/ExpensesRepository';

interface Request {
  name: string;
  value: number;
}

class CreateExpenseService {
  public async execute({ name, value }: Request): Promise<Expense> {
    const expensesRepository = getCustomRepository(ExpensesRepository);
    const expense = expensesRepository.create({ name, value });

    await expensesRepository.save(expense);

    return expense;
  }
}

export default CreateExpenseService;
