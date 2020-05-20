import MockUsersRepository from '../repositories/mocks/MockUsersRepository';
import MockHashProvider from '../providers/HashProvider/mocks/MockHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

let mockUsersRepository: MockUsersRepository;
let mockHashProvider: MockHashProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    mockUsersRepository = new MockUsersRepository();
    mockHashProvider = new MockHashProvider();
    createUserService = new CreateUserService(
      mockUsersRepository,
      mockHashProvider
    );
    authenticateUserService = new AuthenticateUserService(
      mockUsersRepository,
      mockHashProvider
    );
  })

  it('should be able to aythenticate', async () => {
    const userData = {
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    };

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

    await expect(
      authenticateUserService.execute(userData)
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should throw an error if authenticate have wrong password', async () => {
    const userData = {
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    };

    await createUserService.execute(userData);

    await expect(
      authenticateUserService.execute({
        email: userData.email,
        password: 'abcdefg'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
