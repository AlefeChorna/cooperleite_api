import MockUsersRepository from '../repositories/mocks/MockUsersRepository';
import MockStorageProvider from '@shared/container/providers/StorageProvider/mocks/MockStorageProvider';
import MockHashProvider from '../providers/HashProvider/mocks/MockHashProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

let mockUsersRepository: MockUsersRepository;
let mockStorageProvider: MockStorageProvider;
let mockHashProvider: MockHashProvider;
let createUserService: CreateUserService;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatarService', () => {
  beforeEach(() => {
    mockUsersRepository = new MockUsersRepository();
    mockStorageProvider = new MockStorageProvider();
    mockHashProvider = new MockHashProvider();
    createUserService = new CreateUserService(
      mockUsersRepository,
      mockHashProvider
    );
    updateUserAvatarService = new UpdateUserAvatarService(
      mockUsersRepository,
      mockStorageProvider
    );
  })

  it('should be able to update user avatar', async () => {
    const userData = {
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    };
    const user = await createUserService.execute(userData);
    const updatedUser = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'profile.png'
    });

    expect(updatedUser.avatar).toBe('profile.png');
  })

  it('should throw an error if user non existing', async () => {
    await expect(
      updateUserAvatarService.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'profile.png'
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to delete old avatar when updating new one', async () => {
    const userData = {
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    };
    const deleteFile = jest.spyOn(mockStorageProvider, 'deleteFile');
    const user = await createUserService.execute(userData);

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
