import { Router } from 'express';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const authRouter = Router();

authRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  const usersRepository = new UsersRepository();
  const authenticateUserService = new AuthenticateUserService(usersRepository);
  const { user, token } = await authenticateUserService.execute({
    email,
    password,
  });

  delete user.password;

  response.json({ user, token });
});

export default authRouter;
