import MockUsersRepository from '../repositories/mocks/MockUsersRepository';
import MockHashProvider from '../providers/HashProvider/mocks/MockHashProvider';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import ShowProfileService from './ShowProfileService';
import AppError from '@shared/errors/AppError';

let mockUsersRepository: MockUsersRepository;
let mockHashProvider: MockHashProvider;
let mockCacheProvider: MockCacheProvider;
let showProfileService: ShowProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    mockUsersRepository = new MockUsersRepository();
    mockHashProvider = new MockHashProvider();
    mockCacheProvider = new MockCacheProvider();
    showProfileService = new ShowProfileService(
      mockUsersRepository,
      mockCacheProvider,
    );
  })

  it('should not be able to show user if user doesn\'t exists', async () => {
    await expect(
      showProfileService.execute({user_id: 'invalid-user-id'})
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to show user profile', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });
    const profile = await showProfileService.execute({ user_id: user.id });

    expect(profile?.name).toBe('Juca Bala');
    expect(profile?.email).toBe('juca@gmail.com');
  })
})
