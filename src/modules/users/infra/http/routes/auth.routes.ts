import { Router } from 'express';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

const authRouter = Router();

authRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  const authenticateUserService = new AuthenticateUserService();
  const { user, token } = await authenticateUserService.execute({
    email,
    password,
  });

  delete user.password;

  response.json({ user, token });
});

export default authRouter;
