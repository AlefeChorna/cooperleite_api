import MockRuralPropertiesRepository from '../repositories/mocks/MockRuralPropertiesRepository';
import ListRuralPropertiesService from './ListRuralPropertiesService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import AppError from '@shared/errors/AppError';

let mockRuralPropertiesRepository: MockRuralPropertiesRepository;
let mockUsersRepository: MockUsersRepository;
let mockCacheProvider: MockCacheProvider;
let listRuralPropertiesService: ListRuralPropertiesService;

describe('ListRuralPropertiesService', () => {
  beforeEach(() => {
    mockRuralPropertiesRepository = new MockRuralPropertiesRepository();
    mockUsersRepository = new MockUsersRepository();
    mockCacheProvider = new MockCacheProvider();
    listRuralPropertiesService = new ListRuralPropertiesService(
      mockRuralPropertiesRepository,
      mockUsersRepository,
      mockCacheProvider
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      listRuralPropertiesService.execute({
        operator_id: 'non-existing-operator',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should return an empty array if the user does not have registered rural properties', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const ruralProperties = await listRuralPropertiesService.execute({
      operator_id: user.id,
    });

    expect(ruralProperties).toStrictEqual([]);
  })

  it('should be able to list rural properties', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await mockRuralPropertiesRepository.create({
      name: 'Interior of Rio de Janeiro',
      city: 'Niterói',
      state: 'Rio de janeiro',
      operator_id: user.id,
      company_id: user.company_id,
    });

    const ruralProperties = await listRuralPropertiesService.execute({
      operator_id: user.id,
    });

    expect(ruralProperties[0]).toHaveProperty('id');
    expect(ruralProperties[0].name).toBe('Interior of Rio de Janeiro');
    expect(ruralProperties[0].city).toBe('Niterói');
    expect(ruralProperties[0].state).toBe('Rio de janeiro');
    expect(ruralProperties[0].operator_id).toBe(user.id);
    expect(ruralProperties[0].company_id).toBe(user.company_id);
  })

  it('should be able to recover the cache of rural properties when records are listed', async () => {
    const recoverCache = jest.spyOn(mockCacheProvider, 'recover');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await listRuralPropertiesService.execute({
      operator_id: user.id,
    });

    expect(recoverCache).toHaveBeenCalledWith(
      `rural-properties-list:${user.company_id}`
    );
  });
})
