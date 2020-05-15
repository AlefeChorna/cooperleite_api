import MockUsersRepository from '../repositories/mocks/MockUsersRepository';
import MockHashProvider from '../providers/HashProvider/mocks/MockHashProvider';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

describe('CreateUserService', () => {
  it('should be able to create a new user', async () => {
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
    const user = await createUserService.execute(userData);

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('password');
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  })

  it('should throw an error if user email already exists', async () => {
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

    await createUserService.execute(userData)

    expect(
      createUserService.execute(userData)
    ).rejects.toBeInstanceOf(AppError)
  })
})
