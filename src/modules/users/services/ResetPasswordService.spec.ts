import AppError from '@shared/errors/AppError';
import MockUsersRepository from '../repositories/mocks/MockUsersRepository';
import MockUserTokensRepository from '../repositories/mocks/MockUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import MockHashProvider from '../providers/HashProvider/mocks/MockHashProvider';

let mockUsersRepository: MockUsersRepository;
let mockUserTokensRepository: MockUserTokensRepository;
let mockHashProvider: MockHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    mockUsersRepository = new MockUsersRepository();
    mockUserTokensRepository = new MockUserTokensRepository();
    mockHashProvider = new MockHashProvider();

    resetPasswordService = new ResetPasswordService(
      mockUsersRepository,
      mockUserTokensRepository,
      mockHashProvider
    );
  })

  it('should be able to reset password', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    const { token } = await mockUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(mockHashProvider, 'generate');

    await resetPasswordService.execute({
      token,
      password: 'abc123'
    });

    const updatedUser = await mockUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('abc123');
    expect(updatedUser?.password).toBe('abc123');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: 'abc123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await mockUserTokensRepository.generate('non-existing-user');

    await expect(
      resetPasswordService.execute({
        token,
        password: 'abc123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if passed more than 2 hours', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    const { token } = await mockUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      const addedThreeHoursOnCustomDate = customDate.setHours(customDate.getHours() + 3);

      return addedThreeHoursOnCustomDate;
    });

    await expect(
      resetPasswordService.execute({
        token,
        password: 'abc123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
})
