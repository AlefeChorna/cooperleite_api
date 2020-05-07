import { Router } from 'express';

import expensesRouter from './expenses.routes';
import usersRouter from './users.routes';
import authRouter from './auth.routes';

const routes = Router();

routes.use('/signup', usersRouter);
routes.use('/auth', authRouter);
routes.use('/api/v1/expenses', expensesRouter);

export default routes;
