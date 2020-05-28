import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import RuralPropertiesController from '../controllers/RuralPropertiesController';

const ruralPropertiesRouter = Router();
const ruralPropertiesController = new RuralPropertiesController();

ruralPropertiesRouter.use(ensureAuthenticated);

ruralPropertiesRouter.get(
  '/',
  ensureAuthenticated,
  ruralPropertiesController.index,
);

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

ruralPropertiesRouter.put(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.number().required(),
      name: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      operator_id: Joi.string().required(),
    }
  }),
  ruralPropertiesController.update,
);

export default ruralPropertiesRouter;
