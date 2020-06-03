import MockVaccinesRepository from '../repositories/mocks/MockVaccinesRepository';
import UpdateVaccineService from './UpdateVaccineService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import AppError from '@shared/errors/AppError';

let mockVaccinesRepository: MockVaccinesRepository;
let mockUsersRepository: MockUsersRepository;
let mockCacheProvider: MockCacheProvider;
let updateVaccineService: UpdateVaccineService;

describe('UpdateVaccineService', () => {
  beforeEach(() => {
    mockVaccinesRepository = new MockVaccinesRepository();
    mockUsersRepository = new MockUsersRepository();
    mockCacheProvider = new MockCacheProvider();
    updateVaccineService = new UpdateVaccineService(
      mockVaccinesRepository,
      mockUsersRepository,
      mockCacheProvider
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      updateVaccineService.execute({
        id: 1,
        name: 'Aftosa',
        operator_id: 'non-existing-operator',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should throw an error if the vaccine is not found', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await expect(
      updateVaccineService.execute({
        id: 1,
        name: 'Aftosa',
        operator_id: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to update a vaccine', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const vaccine = await mockVaccinesRepository.create({
      name: 'Aftosa',
      operator_id: user.id,
      company_id: user.company_id,
    });

    const updatedVaccine = await updateVaccineService.execute({
      id: vaccine.id,
      name: 'Aftosa 2',
      operator_id: vaccine.operator_id,
    });

    expect(updatedVaccine.id).toBe(vaccine.id);
    expect(updatedVaccine.name).toBe('Aftosa 2');
    expect(updatedVaccine.operator_id).toBe(vaccine.operator_id);
    expect(updatedVaccine.company_id).toBe(vaccine.company_id);
  })

  it('should be able to delete vaccines cache when a record is updated', async () => {
    const deleteCache = jest.spyOn(mockCacheProvider, 'delete');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const vaccine = await mockVaccinesRepository.create({
      name: 'Aftosa',
      operator_id: user.id,
      company_id: user.company_id,
    });

    await updateVaccineService.execute({
      id: vaccine.id,
      name: 'Aftosa 2',
      operator_id: vaccine.operator_id,
    });

    expect(deleteCache).toHaveBeenCalledTimes(2);
  });
})
