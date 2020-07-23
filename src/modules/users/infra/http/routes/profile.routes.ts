import { Router } from 'express';
import multer from 'multer';
import Joi from 'joi';

import uploadConfig from '@config/upload';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ProfileController from '../controllers/ProfileController';
import UserAvatarController from '../controllers/UserAvatarController';
import requestValidator from '@shared/infra/http/middlewares/requestValidator';
import makeJoiErrorMessage from '@shared/utils/makeJoiErrorMessage';

const profileRouter = Router();
const upload = multer(uploadConfig.config.multer);
const profileController = new ProfileController();
const userAvatarController = new UserAvatarController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.put(
  '/',
  requestValidator({
    body: Joi.object({
      name: Joi.string().required().error(makeJoiErrorMessage()),
      email: Joi.string().email().required().error(makeJoiErrorMessage()),
      old_password: Joi.string().error(makeJoiErrorMessage()),
      new_password: Joi.string().error(makeJoiErrorMessage()),
      new_password_confirmation: Joi.string().valid(
        Joi.ref('new_password')
      ).error(makeJoiErrorMessage()),
    })
  }),
  profileController.update
);

profileRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default profileRouter;
