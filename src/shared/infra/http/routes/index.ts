import { Router } from 'express';

import expensesRouter from '@models/expenses/infra/http/routes/expenses.routes';
import usersRouter from '@models/users/infra/http/routes/users.routes';
import authRouter from '@models/users/infra/http/routes/auth.routes';

const routes = Router();

routes.use('/signup', usersRouter);
routes.use('/auth', authRouter);
routes.use('/api/v1/expenses', expensesRouter);

export default routes;
