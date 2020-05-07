import { Router } from 'express';
import multer from 'multer';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const createUserService = new CreateUserService();
    const user = await createUserService.execute({ name, email, password });

    delete user.password;

    response.json(user);
  } catch (err) {
    response.status(400).json({ error: err.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    try {
      const { user, file } = request;
      const updateUserAvatarService = new UpdateUserAvatarService();

      const updatedUser = await updateUserAvatarService.execute({
        user_id: user.id,
        avatarFilename: file.filename,
      });

      delete updatedUser.password;

      response.json(updatedUser);
    } catch (err) {
      response.status(400).json({ error: err.message });
    }
  },
);

export default usersRouter;
