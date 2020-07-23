import { Router } from 'express';
import Joi from 'joi';

import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';
import requestValidator from '@shared/infra/http/middlewares/requestValidator';
import makeJoiErrorMessage from '@shared/utils/makeJoiErrorMessage';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
  '/forgot',
  requestValidator({
    body: Joi.object({
      email: Joi.string().email().required().error(makeJoiErrorMessage()),
    })
  }),
  forgotPasswordController.create
);
passwordRouter.post(
  '/reset',
  requestValidator({
    body: Joi.object({
      token: Joi.string().uuid().required().error(makeJoiErrorMessage()),
      password: Joi.string().min(8).required().error(makeJoiErrorMessage()),
      password_confirmation: Joi.string().min(8).required().valid(
        Joi.ref('password')
      ).error(makeJoiErrorMessage()),
    })
  }),
  resetPasswordController.create
);

export default passwordRouter;
