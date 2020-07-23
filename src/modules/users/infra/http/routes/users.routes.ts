import { Router } from 'express';
import Joi from 'joi';

import UsersController from '../controllers/UsersController';
import requestValidator from '@shared/infra/http/middlewares/requestValidator';
import makeJoiErrorMessage from '@shared/utils/makeJoiErrorMessage';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post(
  '/',
  requestValidator({
    body: Joi.object({
      name: Joi.string().required().error(makeJoiErrorMessage()),
      email: Joi.string().email().required().error(makeJoiErrorMessage()),
      password: Joi.string().min(8).required().error(makeJoiErrorMessage()),
    })
  }),
  usersController.create
);

export default usersRouter;
