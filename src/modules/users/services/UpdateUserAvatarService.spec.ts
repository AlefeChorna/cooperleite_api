import MockUsersRepository from '../repositories/mocks/MockUsersRepository';
import MockStorageProvider from '@shared/container/providers/StorageProvider/mocks/MockStorageProvider';
import MockHashProvider from '../providers/HashProvider/mocks/MockHashProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

describe('UpdateUserAvatarService', () => {
  it('should be able to update user avatar', async () => {
    const userData = {
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    };

    const mockUsersRepository = new MockUsersRepository();
    const mockStorageProvider = new MockStorageProvider();
    const mockHashProvider = new MockHashProvider();

    const createUserService = new CreateUserService(
      mockUsersRepository,
      mockHashProvider
    );

    const user = await createUserService.execute(userData);

    const updateUserAvatarService = new UpdateUserAvatarService(
      mockUsersRepository,
      mockStorageProvider
    );


    const updatedUser = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'profile.png'
    });

    expect(updatedUser.avatar).toBe('profile.png');
  })

  it('should throw an error if user non existing', async () => {
    const mockUsersRepository = new MockUsersRepository();
    const mockStorageProvider = new MockStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      mockUsersRepository,
      mockStorageProvider
    );

    await expect(
      updateUserAvatarService.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'profile.png'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to delete old avatar when updating new one', async () => {
    const userData = {
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    };

    const mockUsersRepository = new MockUsersRepository();
    const mockStorageProvider = new MockStorageProvider();
    const mockHashProvider = new MockHashProvider();

    const deleteFile = jest.spyOn(mockStorageProvider, 'deleteFile');

    const createUserService = new CreateUserService(
      mockUsersRepository,
      mockHashProvider
    );

    const user = await createUserService.execute(userData);

    const updateUserAvatarService = new UpdateUserAvatarService(
      mockUsersRepository,
      mockStorageProvider
    );

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'profile.png'
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'new-profile.png'
    });

    expect(deleteFile).toHaveBeenCalledWith('profile.png');
  })
})
