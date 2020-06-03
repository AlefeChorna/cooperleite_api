import MockVaccinesRepository from '../repositories/mocks/MockVaccinesRepository';
import CreateVaccineService from './CreateVaccineService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import AppError from '@shared/errors/AppError';

let mockVaccinesRepository: MockVaccinesRepository;
let mockUsersRepository: MockUsersRepository;
let mockCacheProvider: MockCacheProvider;
let createVaccineService: CreateVaccineService;

describe('CreateVaccineService', () => {
  beforeEach(() => {
    mockVaccinesRepository = new MockVaccinesRepository();
    mockUsersRepository = new MockUsersRepository();
    mockCacheProvider = new MockCacheProvider();
    createVaccineService = new CreateVaccineService(
      mockVaccinesRepository,
      mockUsersRepository,
      mockCacheProvider
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      createVaccineService.execute({
        name: 'Aftosa',
        operator_id: 'non-existing-operator',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to create a new vaccine', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    const vaccine = await createVaccineService.execute({
      name: 'Aftosa',
      operator_id: user.id,
    });

    expect(vaccine).toHaveProperty('id');
    expect(vaccine.name).toBe('Aftosa');
    expect(vaccine.operator_id).toBe(user.id);
    expect(vaccine.company_id).toBe(user.company_id);
  })

  it('should be able to delete vaccines cache when a new record is created', async () => {
    const deleteCache = jest.spyOn(mockCacheProvider, 'delete');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await createVaccineService.execute({
      name: 'Aftosa',
      operator_id: user.id,
    });

    expect(deleteCache).toHaveBeenCalled();
  })
})
