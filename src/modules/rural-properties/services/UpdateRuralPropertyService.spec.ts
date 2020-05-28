import MockRuralPropertiesRepository from '../repositories/mocks/MockRuralPropertiesRepository';
import UpdateRuralPropertyService from './UpdateRuralPropertyService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import AppError from '@shared/errors/AppError';

let mockRuralPropertiesRepository: MockRuralPropertiesRepository;
let mockUsersRepository: MockUsersRepository;
let mockCacheProvider: MockCacheProvider;
let updateRuralPropertyService: UpdateRuralPropertyService;

describe('UpdateRuralPropertyService', () => {
  beforeEach(() => {
    mockRuralPropertiesRepository = new MockRuralPropertiesRepository();
    mockUsersRepository = new MockUsersRepository();
    mockCacheProvider = new MockCacheProvider();
    updateRuralPropertyService = new UpdateRuralPropertyService(
      mockRuralPropertiesRepository,
      mockUsersRepository,
      mockCacheProvider
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      updateRuralPropertyService.execute({
        id: 1,
        name: 'Interior of Rio de Janeiro',
        city: 'Niterói',
        state: 'Rio de janeiro',
        operator_id: 'non-existing-operator',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should throw an error if the rural property is not found', async () => {
    await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await expect(
      updateRuralPropertyService.execute({
        id: 1,
        name: 'Interior of Rio de Janeiro',
        city: 'Niterói',
        state: 'Rio de janeiro',
        operator_id: 'non-existing-operator',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to update a new rural property', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const ruralProperty = await mockRuralPropertiesRepository.create({
      name: 'Interior of Rio de Janeiro',
      city: 'Niterói',
      state: 'Rio de janeiro',
      operator_id: user.id,
      company_id: user.company_id,
    });

    const updatedRuralProperty = await updateRuralPropertyService.execute({
      id: ruralProperty.id,
      name: 'Interior of Paraná',
      city: 'Curitiba',
      state: 'Paraná',
      operator_id: ruralProperty.operator_id,
    });

    expect(updatedRuralProperty.id).toBe(ruralProperty.id);
    expect(updatedRuralProperty.name).toBe('Interior of Paraná');
    expect(updatedRuralProperty.city).toBe('Curitiba');
    expect(updatedRuralProperty.state).toBe('Paraná');
    expect(updatedRuralProperty.operator_id).toBe(ruralProperty.operator_id);
    expect(updatedRuralProperty.company_id).toBe(ruralProperty.company_id);
  })

  it('should be able to delete rural property cache when a record is updated', async () => {
    const deleteCache = jest.spyOn(mockCacheProvider, 'delete');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const ruralProperty = await mockRuralPropertiesRepository.create({
      name: 'Interior of Rio de Janeiro',
      city: 'Niterói',
      state: 'Rio de janeiro',
      operator_id: user.id,
      company_id: user.company_id,
    });

    await updateRuralPropertyService.execute({
      id: ruralProperty.id,
      name: 'Interior of Paraná',
      city: 'Curitiba',
      state: 'Paraná',
      operator_id: ruralProperty.operator_id,
    });

    expect(deleteCache).toHaveBeenCalled();
  });
})
