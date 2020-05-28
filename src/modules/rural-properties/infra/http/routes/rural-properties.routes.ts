import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import RuralPropertiesController from '../controllers/RuralPropertiesController';

const ruralPropertiesRouter = Router();
const ruralPropertiesController = new RuralPropertiesController();

ruralPropertiesRouter.use(ensureAuthenticated);

ruralPropertiesRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
    }
  }),
  ruralPropertiesController.create,
);

export default ruralPropertiesRouter;
