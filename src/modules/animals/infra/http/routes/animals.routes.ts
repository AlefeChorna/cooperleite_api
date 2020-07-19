import { Router } from 'express';
import { celebrate, Segments, Joi as CJoi } from 'celebrate';
import Joi from 'joi';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AnimalsController from '../controllers/AnimalsController';
import requestValidator from '@shared/infra/http/middlewares/requestValidator';
import makeJoiErrorMessage from '@shared/utils/makeJoiErrorMessage';

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
  requestValidator({
    body: Joi.object({
      name: Joi.string().required().error(makeJoiErrorMessage()),
      earring_number: Joi.number().required().error(makeJoiErrorMessage()),
      gender: Joi.string().required().error(makeJoiErrorMessage()),
      breed: Joi.string().allow(''),
      weight: Joi.number().error(makeJoiErrorMessage()).allow(''),
      lactating: Joi.boolean(),
      date_birth: Joi.string(),
    })
  }),
  animalsController.create,
);

animalsRouter.put(
  '/',
  ensureAuthenticated,
  requestValidator({
    body: Joi.object({
      name: Joi.string().required().error(makeJoiErrorMessage()),
      earring_number: Joi.number().required().error(makeJoiErrorMessage()),
      gender: Joi.string().required().error(makeJoiErrorMessage()),
      breed: Joi.string().allow(''),
      weight: Joi.number().allow('').error(makeJoiErrorMessage()),
      lactating: Joi.boolean(),
      date_birth: Joi.string(),
      animal_vaccines: Joi.array().items({
        vaccine_id: Joi.number().required(),
        applied_at: Joi.string().required(),
        lack_at: Joi.string().required(),
      }),
    })
  }),
  animalsController.update,
);

export default animalsRouter;
