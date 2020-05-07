import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('Email ou senha inválido');
    }

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new Error('Email ou senha inválido');
    }

    const token = sign({}, '1afcd9817874f3af69237e8ff1d411c0', {
      subject: user.id,
      expiresIn: '2d',
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
