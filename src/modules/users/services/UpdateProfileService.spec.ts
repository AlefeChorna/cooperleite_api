import MockUsersRepository from '../repositories/mocks/MockUsersRepository';
import MockHashProvider from '../providers/HashProvider/mocks/MockHashProvider';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import UpdateProfileService from './UpdateProfileService';
import AppError from '@shared/errors/AppError';

let mockUsersRepository: MockUsersRepository;
let mockHashProvider: MockHashProvider;
let mockCacheProvider: MockCacheProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    mockUsersRepository = new MockUsersRepository();
    mockHashProvider = new MockHashProvider();
    mockCacheProvider = new MockCacheProvider();
    updateProfileService = new UpdateProfileService(
      mockUsersRepository,
      mockHashProvider,
      mockCacheProvider,
    );
  })

  it('should not be able to update user if user does not exists', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'invalid-user-id',
        name: 'Jhon Doe',
        email: 'juca@gmail.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to update user profile', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });
    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Juca D. Bala',
      email: 'jucabala@gmail.com',
    });

    expect(updatedUser?.name).toBe('Juca D. Bala');
    expect(updatedUser?.email).toBe('jucabala@gmail.com');
  })

  it('should not be able to update user email if new email belongs to another user', async () => {
    await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    const user = await mockUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhon@gmail.com',
      password: '123123'
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Jhon Doe',
        email: 'juca@gmail.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to update user password', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });
    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Juca D. Bala',
      email: 'jucabala@gmail.com',
      old_password: '123456',
      new_password: '123123'
    });

    expect(updatedUser?.password).toBe('123123');
  })

  it('should not be able to update user password without old password', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Juca D. Bala',
        email: 'jucabala@gmail.com',
        new_password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should not be able to update user password with wrong old password', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Juca D. Bala',
        email: 'jucabala@gmail.com',
        old_password: '123666',
        new_password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError);
  })
})
