import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  new_password?: string;
}

@injectable()
class UpdateProfileService {
  private usersRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('HashProvider')
    hashProvider: IHashProvider,

    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
    this.cacheProvider = cacheProvider;
  }

  public async execute({
    user_id,
    name,
    email,
    old_password,
    new_password
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);
    const newUserEmailBelongsToAnotherUser = (
      userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id
    );

    if (newUserEmailBelongsToAnotherUser) {
      throw new AppError({ email: 'E-mail já está em uso' }, 422);
    }

    if (new_password && !old_password) {
      throw new AppError(
        'You need to inform the old password to se a new password',
        422
      );
    }

    if (new_password && old_password) {
      const oldPasswordIsValid = await this.hashProvider.compare(
        old_password,
        user.password
      );

      if (!oldPasswordIsValid) {
        throw new AppError({ old_password: 'Senha atual incorreta' }, 422);
      }

      Object.assign(user, {
        password: await this.hashProvider.generate(new_password)
      });
    }

    Object.assign(user, { name, email });

    const updatedUser = this.usersRepository.save(user);

    await this.cacheProvider.delete(`profile-show:${user_id}`);

    return updatedUser;
  }
}

export default UpdateProfileService;
