import { Router } from 'express';

import ExpensesRepository from '@modules/expenses/infra/typeorm/repositories/ExpensesRepository';
import CreateExpenseService from '@modules/expenses/services/CreateExpenseService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const expensesRouter = Router();

expensesRouter.use(ensureAuthenticated);

// expensesRouter.get('/', async (request, response) => {
//   const expenses = await expensesRepository.find();

//   response.json(expenses);
// });

expensesRouter.post('/', async (request, response) => {
  const { name, value, user_id } = request.body;
  const expensesRepository = new ExpensesRepository();
  const createExpenseService = new CreateExpenseService(expensesRepository);
  const expense = await createExpenseService.execute({
    name,
    value,
    user_id,
  });

  response.json(expense);
});

export default expensesRouter;
