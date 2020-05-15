import MockUsersRepository from '../repositories/mocks/MockUsersRepository';
import MockHashProvider from '../providers/HashProvider/mocks/MockHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

describe('AuthenticateUserService', () => {
  it('should be able to aythenticate', async () => {
    const userData = {
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    };
    const mockUsersRepository = new MockUsersRepository();
    const mockHashProvider = new MockHashProvider();
    const createUserService = new CreateUserService(
      mockUsersRepository,
      mockHashProvider
    );
    const authenticateUserService = new AuthenticateUserService(
      mockUsersRepository,
      mockHashProvider
    );

    await createUserService.execute(userData);

    const authentication = await authenticateUserService.execute({
      email: userData.email,
      password: userData.password
    })

    expect(authentication).toHaveProperty('token');
    expect(authentication).toHaveProperty('user');
    expect(authentication.user).toBeInstanceOf(User);
  })

  it('should throw an error if authenticate with non existing user', async () => {
    const userData = {
      email: 'juca@gmail.com',
      password: '123456'
    };
    const mockUsersRepository = new MockUsersRepository();
    const mockHashProvider = new MockHashProvider();
    const authenticateUserService = new AuthenticateUserService(
      mockUsersRepository,
      mockHashProvider
    );

    expect(
      authenticateUserService.execute(userData)
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should throw an error if authenticate have wrong password', async () => {
    const userData = {
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    };
    const mockUsersRepository = new MockUsersRepository();
    const mockHashProvider = new MockHashProvider();
    const createUserService = new CreateUserService(
      mockUsersRepository,
      mockHashProvider
    );
    const authenticateUserService = new AuthenticateUserService(
      mockUsersRepository,
      mockHashProvider
    );

    await createUserService.execute(userData);

    expect(
      authenticateUserService.execute({
        email: userData.email,
        password: 'abcdefg'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
