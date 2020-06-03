import { Router } from 'express';

import expensesRouter from '@modules/expenses/infra/http/routes/expenses.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import authRouter from '@modules/users/infra/http/routes/auth.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import ruralPropertiesRouter from '@modules/rural-properties/infra/http/routes/rural-properties.routes';
import vaccinesRouter from '@modules/vaccines/infra/http/routes/vaccines.routes';

const routes = Router();

routes.use('/signup', usersRouter);
routes.use('/auth', authRouter);
routes.use('/password', passwordRouter);
routes.use('/api/v1/expenses', expensesRouter);
routes.use('/api/v1/profile', profileRouter);
routes.use('/api/v1/rural-properties', ruralPropertiesRouter);
routes.use('/api/v1/vaccines', vaccinesRouter);

export default routes;
