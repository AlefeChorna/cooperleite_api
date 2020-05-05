import { Router } from 'express';
import { uuid } from 'uuidv4';

const expensesRouter = Router();
const expenses = [];

expensesRouter.post('/', (request, response) => {
  const { name, value } = request.body;
  const expense = {
    id: uuid(),
    name,
    value,
  };

  expenses.push(expense);

  response.json(expense);
});

export default expensesRouter;
