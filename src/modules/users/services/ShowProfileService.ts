import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id: string;
}

@injectable()
class ShowProfileService {
  private usersRepository: IUsersRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.usersRepository = usersRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute({ user_id }: IRequest): Promise<User> {
    const profileCacheProfileKey = `profile-show:${user_id}`;
    let user = await this.cacheProvider.recover<User>(profileCacheProfileKey);

    if (!user) {
      user = await this.usersRepository.findById(user_id);

      if (!user) {
        throw new AppError('User not found');
      }

      await this.cacheProvider.save(
        profileCacheProfileKey,
        user
      );
    }

    return user;
  }
}

export default ShowProfileService;
