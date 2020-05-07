import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const authRouter = Router();

authRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;
    const authenticateUserService = new AuthenticateUserService();
    const { user, token } = await authenticateUserService.execute({
      email,
      password,
    });

    delete user.password;

    response.json({ user, token });
  } catch (err) {
    response.status(400).json({ error: err.message });
  }
});

export default authRouter;
