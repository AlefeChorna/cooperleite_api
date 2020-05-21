import { injectable, inject } from 'tsyringe';
import { differenceInHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  private usersRepository: IUsersRepository;

  private userTokensRepository: IUserTokensRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    hashProvider: IHashProvider
  ) {
    this.usersRepository = usersRepository;
    this.userTokensRepository = userTokensRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists', 422);
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists', 422);
    }

    const tokenCreatedAt = userToken.created_at;
    const tokenHasExpired = differenceInHours(Date.now(), tokenCreatedAt) >= 2;

    if (tokenHasExpired) {
      throw new AppError('Token expired');
    }

    Object.assign(user, {
      password: await this.hashProvider.generate(password)
    });

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
