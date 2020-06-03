import MockVaccinesRepository from '../repositories/mocks/MockVaccinesRepository';
import ListVaccinesService from './ListVaccinesService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import AppError from '@shared/errors/AppError';

let mockVaccinesRepository: MockVaccinesRepository;
let mockUsersRepository: MockUsersRepository;
let mockCacheProvider: MockCacheProvider;
let listVaccinesService: ListVaccinesService;

describe('ListVaccinesService', () => {
  beforeEach(() => {
    mockVaccinesRepository = new MockVaccinesRepository();
    mockUsersRepository = new MockUsersRepository();
    mockCacheProvider = new MockCacheProvider();
    listVaccinesService = new ListVaccinesService(
      mockVaccinesRepository,
      mockUsersRepository,
      mockCacheProvider
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      listVaccinesService.execute({
        operator_id: 'non-existing-operator',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should return an empty array if the user does not have registered vaccines', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const vaccines = await listVaccinesService.execute({
      operator_id: user.id,
    });

    expect(vaccines).toStrictEqual([]);
  })

  it('should be able to list vaccines', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await mockVaccinesRepository.create({
      name: 'Aftosa',
      operator_id: user.id,
      company_id: user.company_id,
    });

    const vaccines = await listVaccinesService.execute({
      operator_id: user.id,
    });

    expect(vaccines[0]).toHaveProperty('id');
    expect(vaccines[0].name).toBe('Aftosa');
    expect(vaccines[0].operator_id).toBe(user.id);
    expect(vaccines[0].company_id).toBe(user.company_id);
  })

  it('should be able to recover the cache of vaccines when records are listed', async () => {
    const recoverCache = jest.spyOn(mockCacheProvider, 'recover');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await listVaccinesService.execute({
      operator_id: user.id,
    });

    expect(recoverCache).toHaveBeenCalledWith(
      `vaccines-list:${user.company_id}`
    );
  })

  it('should be able to save the cache of vaccines', async () => {
    const saveCache = jest.spyOn(mockCacheProvider, 'save');

    let user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    Object.assign(user, { company_id: user.id });

    user = await mockUsersRepository.save(user);

    await mockVaccinesRepository.create({
      name: 'Aftosa',
      operator_id: user.id,
      company_id: user.company_id,
    });

    await listVaccinesService.execute({
      operator_id: user.id,
    });

    expect(saveCache).toHaveBeenCalled();
  })
})
