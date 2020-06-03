import MockRuralPropertiesRepository from '../repositories/mocks/MockRuralPropertiesRepository';
import ShowRuralPropertyService from './ShowRuralPropertyService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import AppError from '@shared/errors/AppError';

let mockRuralPropertiesRepository: MockRuralPropertiesRepository;
let mockUsersRepository: MockUsersRepository;
let mockCacheProvider: MockCacheProvider;
let showRuralPropertyService: ShowRuralPropertyService;

describe('ShowRuralPropertyService', () => {
  beforeEach(() => {
    mockRuralPropertiesRepository = new MockRuralPropertiesRepository();
    mockUsersRepository = new MockUsersRepository();
    mockCacheProvider = new MockCacheProvider();
    showRuralPropertyService = new ShowRuralPropertyService(
      mockRuralPropertiesRepository,
      mockUsersRepository,
      mockCacheProvider
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      showRuralPropertyService.execute({
        operator_id: 'non-existing-operator',
        rural_property_id: 1
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should return undefined if a rural property is not found', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const ruralProperty = await showRuralPropertyService.execute({
      operator_id: user.id,
      rural_property_id: 1
    });

    expect(ruralProperty).toBe(undefined);
  })

  it('should be able to show a rural property', async () => {
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

    const updatedRuralProperty = await showRuralPropertyService.execute({
      operator_id: user.id,
      rural_property_id: ruralProperty.id,
    });

    expect(updatedRuralProperty?.id).toBe(ruralProperty.id);
    expect(updatedRuralProperty?.name).toBe('Interior of Rio de Janeiro');
    expect(updatedRuralProperty?.city).toBe('Niterói');
    expect(updatedRuralProperty?.state).toBe('Rio de janeiro');
    expect(updatedRuralProperty?.operator_id).toBe(ruralProperty.operator_id);
    expect(updatedRuralProperty?.company_id).toBe(ruralProperty.company_id);
  })

  it('should be able to recover the cache of rural property when the record is showed', async () => {
    const recoverCache = jest.spyOn(mockCacheProvider, 'recover');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await showRuralPropertyService.execute({
      operator_id: user.id,
      rural_property_id: 1,
    });

    expect(recoverCache).toHaveBeenCalledWith(
      `rural-property-show:${user.company_id}:1`
    );
  });

  it('should be able to save the cache of rural property', async () => {
    const saveCache = jest.spyOn(mockCacheProvider, 'save');

    let user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    Object.assign(user, { company_id: user.id });

    user = await mockUsersRepository.save(user);

    const ruralProperty = await mockRuralPropertiesRepository.create({
      name: 'Interior of Rio de Janeiro',
      city: 'Niterói',
      state: 'Rio de janeiro',
      operator_id: user.id,
      company_id: user.company_id,
    });

    await showRuralPropertyService.execute({
      operator_id: user.id,
      rural_property_id: ruralProperty.id,
    });

    expect(saveCache).toHaveBeenCalled();
  });
})
