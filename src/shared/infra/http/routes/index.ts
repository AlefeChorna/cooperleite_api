import { Router } from 'express';

import expensesRouter from '@modules/expenses/infra/http/routes/expenses.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import authRouter from '@modules/users/infra/http/routes/auth.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import ruralPropertiesRouter from '@modules/rural-properties/infra/http/routes/rural-properties.routes';
import vaccinesRouter from '@modules/vaccines/infra/http/routes/vaccines.routes';
import productsRouter from '@modules/products/infra/http/routes/products.routes';

const routes = Router();

routes.use('/signup', usersRouter);
routes.use('/auth', authRouter);
routes.use('/password', passwordRouter);
routes.use('/api/v1/expenses', expensesRouter);
routes.use('/api/v1/profile', profileRouter);
routes.use('/api/v1/rural-properties', ruralPropertiesRouter);
routes.use('/api/v1/vaccines', vaccinesRouter);
routes.use('/api/v1/products', productsRouter);

export default routes;
