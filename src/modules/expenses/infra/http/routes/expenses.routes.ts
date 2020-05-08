import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import ExpensesRepository from '../repositories/ExpensesRepository';
import CreateExpenseService from '../services/CreateExpenseService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const expensesRouter = Router();

expensesRouter.use(ensureAuthenticated);

expensesRouter.get('/', async (request, response) => {
  const expensesRepository = getCustomRepository(ExpensesRepository);
  const expenses = await expensesRepository.find();

  response.json(expenses);
});

expensesRouter.post('/', async (request, response) => {
  const { name, value, user_id: userId } = request.body;
  const createExpenseService = new CreateExpenseService();
  const expense = await createExpenseService.execute({
    name,
    value,
    userId,
  });

  response.json(expense);
});

export default expensesRouter;
