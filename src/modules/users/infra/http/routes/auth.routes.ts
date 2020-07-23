import { Router } from 'express';
import Joi from 'joi';

import AuthController from '../controllers/AuthController';
import requestValidator from '@shared/infra/http/middlewares/requestValidator';
import makeJoiErrorMessage from '@shared/utils/makeJoiErrorMessage';

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  '/',
  requestValidator({
    body: Joi.object({
      email: Joi.string().email().required().error(makeJoiErrorMessage()),
      password: Joi.string().required().error(makeJoiErrorMessage()),
    })
  }),
  authController.create
);

export default authRouter;
