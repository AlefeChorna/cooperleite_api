import Expense from '../infra/typeorm/entities/Expense';
import IExpensesRepository from '../repositories/IExpensesRepository';

interface IRequest {
  name: string;
  value: number;
  user_id: string;
}

class CreateExpenseService {
  private expensesRepository: IExpensesRepository;

  constructor(expensesRepository: IExpensesRepository) {
    this.expensesRepository = expensesRepository;
  }

  public async execute({ name, value, user_id }: IRequest): Promise<Expense> {
    const expense = this.expensesRepository.create({ name, value, user_id });

    return expense;
  }
}

export default CreateExpenseService;
