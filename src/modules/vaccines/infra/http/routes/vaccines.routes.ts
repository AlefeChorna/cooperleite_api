import { Router } from 'express';
import Joi from 'joi';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import VaccinesController from '../controllers/VaccinesController';
import requestValidator from '@shared/infra/http/middlewares/requestValidator';
import makeJoiErrorMessage from '@shared/utils/makeJoiErrorMessage';

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
  requestValidator({
    params: Joi.object({
      id: Joi.number().required().error(makeJoiErrorMessage()),
    }),
  }),
  vaccinesController.show,
);

vaccinesRouter.post(
  '/',
  ensureAuthenticated,
  requestValidator({
    body: Joi.object({
      name: Joi.string().required().error(makeJoiErrorMessage()),
    })
  }),
  vaccinesController.create,
);

vaccinesRouter.put(
  '/:id',
  ensureAuthenticated,
  requestValidator({
    params: Joi.object({
      id: Joi.number().required().error(makeJoiErrorMessage()),
    }),
    body: Joi.object({
      name: Joi.string().required().error(makeJoiErrorMessage()),
    })
  }),
  vaccinesController.update,
);

export default vaccinesRouter;
