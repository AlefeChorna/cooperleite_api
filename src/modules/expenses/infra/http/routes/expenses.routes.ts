import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ExpensesController from '../controllers/ExpensesController';

const expensesRouter = Router();
const expensesController = new ExpensesController();

expensesRouter.use(ensureAuthenticated);

expensesRouter.post('/', expensesController.create);

export default expensesRouter;
