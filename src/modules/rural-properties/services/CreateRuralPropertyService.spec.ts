import MockRuralPropertiesRepository from '../repositories/mocks/MockRuralPropertiesRepository';
import CreateRuralPropertyService from './CreateRuralPropertyService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import AppError from '@shared/errors/AppError';

let mockRuralPropertiesRepository: MockRuralPropertiesRepository;
let mockUsersRepository: MockUsersRepository;
let mockCacheProvider: MockCacheProvider;
let createRuralPropertyService: CreateRuralPropertyService;

describe('CreateRuralPrepertyService', () => {
  beforeEach(() => {
    mockRuralPropertiesRepository = new MockRuralPropertiesRepository();
    mockUsersRepository = new MockUsersRepository();
    mockCacheProvider = new MockCacheProvider();
    createRuralPropertyService = new CreateRuralPropertyService(
      mockRuralPropertiesRepository,
      mockUsersRepository,
      mockCacheProvider
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      createRuralPropertyService.execute({
        name: 'Interior of Rio de Janeiro',
        city: 'Niterói',
        state: 'Rio de janeiro',
        operator_id: 'non-existing-operator',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to create a new rural property', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    const ruralProperty = await createRuralPropertyService.execute({
      name: 'Interior of Rio de Janeiro',
      city: 'Niterói',
      state: 'Rio de janeiro',
      operator_id: user.id,
    });

    expect(ruralProperty).toHaveProperty('id');
    expect(ruralProperty.name).toBe('Interior of Rio de Janeiro');
    expect(ruralProperty.city).toBe('Niterói');
    expect(ruralProperty.state).toBe('Rio de janeiro');
    expect(ruralProperty.operator_id).toBe(user.id);
    expect(ruralProperty.company_id).toBe(user.company_id);
  })

  it('should be able to delete rural property cache when a new record is created', async () => {
    const deleteCache = jest.spyOn(mockCacheProvider, 'delete');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await createRuralPropertyService.execute({
      name: 'Interior of Rio de Janeiro',
      city: 'Niterói',
      state: 'Rio de janeiro',
      operator_id: user.id,
    });

    expect(deleteCache).toHaveBeenCalled();
  });
})
