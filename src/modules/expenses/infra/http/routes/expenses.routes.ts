import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ExpensesController from '../controllers/ExpensesController';

const expensesRouter = Router();
const expensesController = new ExpensesController();

expensesRouter.use(ensureAuthenticated);

expensesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      value: Joi.number().required(),
      company_id: Joi.string().uuid().required(),
    }
  }),
  expensesController.create
);

export default expensesRouter;
