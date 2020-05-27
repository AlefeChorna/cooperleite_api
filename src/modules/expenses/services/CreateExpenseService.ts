import { injectable, inject } from 'tsyringe';

import Expense from '../infra/typeorm/entities/Expense';
import IExpensesRepository from '../repositories/IExpensesRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

interface IRequest {
  name: string;
  value: number;
  company_id: string;
}

@injectable()
class CreateExpenseService {
  private expensesRepository: IExpensesRepository;

  private notificationsRepository: INotificationsRepository;

  constructor(
    @inject('ExpensesRepository')
    expensesRepository: IExpensesRepository,

    @inject('NotificationsRepository')
    notificationsRepository: INotificationsRepository,
  ) {
    this.expensesRepository = expensesRepository;
    this.notificationsRepository = notificationsRepository;
  }

  public async execute({ name, value, company_id }: IRequest): Promise<Expense> {
    const expense = this.expensesRepository.create({ name, value, company_id });

    await this.notificationsRepository.create({
      recipient_id: company_id,
      content: 'Nova despesa criada com sucesso!',
    })

    return expense;
  }
}

export default CreateExpenseService;
