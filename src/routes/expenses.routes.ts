import { Router } from 'express';
import ExpensesRepository from '../repositories/ExpensesRepository';

const expensesRouter = Router();
const expensesRepository = new ExpensesRepository();

expensesRouter.get('/', (request, response) => {
  const expenses = expensesRepository.all();

  response.json(expenses);
});

expensesRouter.post('/', (request, response) => {
  const { name, value } = request.body;
  const expense = expensesRepository.create({ name, value });

  response.json(expense);
});

export default expensesRouter;
