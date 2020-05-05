import { Router } from 'express';

import expensesRoutes from './expenses.routes';

const routes = Router();

routes.use('/api/v1/expenses', expensesRoutes);

export default routes;
