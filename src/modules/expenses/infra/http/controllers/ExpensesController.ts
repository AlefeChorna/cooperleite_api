import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateExpenseService from '@modules/expenses/services/CreateExpenseService';

export default class ExpensesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, value, company_id } = request.body;
    const createExpenseService = container.resolve(CreateExpenseService);
    const expense = await createExpenseService.execute({
      name,
      value,
      company_id,
    });

    return response.json(expense);
  }
}
