import MockUsersRepository from '../repositories/mocks/MockUsersRepository';
import MockHashProvider from '../providers/HashProvider/mocks/MockHashProvider';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

let mockUsersRepository: MockUsersRepository;
let mockHashProvider: MockHashProvider;
let createUserService: CreateUserService;

describe('CreateUserService', () => {
  beforeEach(() => {
    mockUsersRepository = new MockUsersRepository();
    mockHashProvider = new MockHashProvider();
    createUserService = new CreateUserService(
      mockUsersRepository,
      mockHashProvider
    );
  })

  it('should be able to create a new user', async () => {
    const userData = {
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    };
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

    await createUserService.execute(userData)

    await expect(
      createUserService.execute(userData)
    ).rejects.toBeInstanceOf(AppError)
  })

  it('ensure user id is equal user company id', async () => {
    const userData = {
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    };

    const user = await createUserService.execute(userData)

    expect(user.company_id).toEqual(user.id);
  })
})
