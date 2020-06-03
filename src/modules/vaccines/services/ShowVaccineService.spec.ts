import MockVaccinesRepository from '../repositories/mocks/MockVaccinesRepository';
import ShowVaccineService from './ShowVaccineService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import AppError from '@shared/errors/AppError';

let mockVaccinesRepository: MockVaccinesRepository;
let mockUsersRepository: MockUsersRepository;
let mockCacheProvider: MockCacheProvider;
let showVaccineService: ShowVaccineService;

describe('ShowVaccineService', () => {
  beforeEach(() => {
    mockVaccinesRepository = new MockVaccinesRepository();
    mockUsersRepository = new MockUsersRepository();
    mockCacheProvider = new MockCacheProvider();
    showVaccineService = new ShowVaccineService(
      mockVaccinesRepository,
      mockUsersRepository,
      mockCacheProvider
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      showVaccineService.execute({
        operator_id: 'non-existing-operator',
        vaccine_id: 1
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should return undefined if a vaccine is not found', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const vaccine = await showVaccineService.execute({
      operator_id: user.id,
      vaccine_id: 1
    });

    expect(vaccine).toBe(undefined);
  })

  it('should be able to show a vaccine', async () => {
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

    const updatedVaccine = await showVaccineService.execute({
      operator_id: user.id,
      vaccine_id: vaccine.id,
    });

    expect(updatedVaccine?.id).toBe(vaccine.id);
    expect(updatedVaccine?.name).toBe('Aftosa');
    expect(updatedVaccine?.operator_id).toBe(vaccine.operator_id);
    expect(updatedVaccine?.company_id).toBe(vaccine.company_id);
  })

  it('should be able to recover the cache of vaccine when the record is showed', async () => {
    const recoverCache = jest.spyOn(mockCacheProvider, 'recover');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await showVaccineService.execute({
      operator_id: user.id,
      vaccine_id: 1,
    });

    expect(recoverCache).toHaveBeenCalledWith(
      `vaccine-show:${user.company_id}:1`
    );
  })

  it('should be able to save the cache of vaccine', async () => {
    const saveCache = jest.spyOn(mockCacheProvider, 'save');

    let user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    Object.assign(user, { company_id: user.id });

    user = await mockUsersRepository.save(user);

    const vaccine = await mockVaccinesRepository.create({
      name: 'Aftosa',
      operator_id: user.id,
      company_id: user.company_id,
    });

    await showVaccineService.execute({
      operator_id: user.id,
      vaccine_id: vaccine.id,
    });

    expect(saveCache).toHaveBeenCalled();
  })
})
