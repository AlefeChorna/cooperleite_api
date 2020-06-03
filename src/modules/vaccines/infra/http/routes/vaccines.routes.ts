import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import VaccinesController from '../controllers/VaccinesController';

const vaccinesRouter = Router();
const vaccinesController = new VaccinesController();

vaccinesRouter.use(ensureAuthenticated);

vaccinesRouter.get(
  '/',
  ensureAuthenticated,
  vaccinesController.index,
);

vaccinesRouter.get(
  '/:id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    }
  }),
  vaccinesController.show,
);

vaccinesRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
    }
  }),
  vaccinesController.create,
);

vaccinesRouter.put(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.number().required(),
      name: Joi.string().required(),
    }
  }),
  vaccinesController.update,
);

export default vaccinesRouter;
