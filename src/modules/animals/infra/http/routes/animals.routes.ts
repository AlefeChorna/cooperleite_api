import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AnimalsController from '../controllers/AnimalsController';

const animalsRouter = Router();
const animalsController = new AnimalsController();

animalsRouter.use(ensureAuthenticated);

animalsRouter.get(
  '/',
  ensureAuthenticated,
  animalsController.index,
);

animalsRouter.get(
  '/:id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    }
  }),
  animalsController.show,
);

animalsRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      earring_number: Joi.number().required(),
      gender: Joi.string().required(),
      breed: Joi.string(),
      weight: Joi.number(),
      lactating: Joi.boolean(),
      date_birth: Joi.string(),
    }
  }),
  animalsController.create,
);

animalsRouter.put(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.number().required(),
      name: Joi.string(),
      earring_number: Joi.number(),
      gender: Joi.string(),
      breed: Joi.string(),
      weight: Joi.number(),
      lactating: Joi.boolean(),
      date_birth: Joi.string(),
      animal_vaccines: Joi.array().items({
        vaccine_id: Joi.number().required(),
        applied_at: Joi.string().required(),
        lack_at: Joi.string().required(),
      }),
    }
  }),
  animalsController.update,
);

export default animalsRouter;
