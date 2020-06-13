import { parseISO } from 'date-fns';

import MockAnimalsRepository from '../repositories/mocks/MockAnimalsRepository';
import ListAnimalsService from './ListAnimalsService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import AppError from '@shared/errors/AppError';

let mockAnimalsRepository: MockAnimalsRepository;
let mockUsersRepository: MockUsersRepository;
let mockCacheProvider: MockCacheProvider;
let listAnimalsService: ListAnimalsService;

describe('ListAnimalsService', () => {
  beforeEach(() => {
    mockAnimalsRepository = new MockAnimalsRepository();
    mockUsersRepository = new MockUsersRepository();
    mockCacheProvider = new MockCacheProvider();
    listAnimalsService = new ListAnimalsService(
      mockAnimalsRepository,
      mockUsersRepository,
      mockCacheProvider,
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      listAnimalsService.execute({
        operator_id: 'non-existing-operator',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should return an empty array if the user does not have registered animals', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const animals = await listAnimalsService.execute({
      operator_id: user.id,
    });

    expect(animals).toStrictEqual([]);
  })

  it('should be able to list animals', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await mockAnimalsRepository.create({
      name: 'Tim',
      gender: 'M',
      earring_number: 1,
      breed: 'Nelore',
      date_birth: parseISO('2013-10-10'),
      company_id: user.company_id,
      operator_id: user.id,
    });

    const animals = await listAnimalsService.execute({
      operator_id: user.id,
    });

    expect(animals[0]).toHaveProperty('id');
    expect(animals[0].name).toBe('Tim');
    expect(animals[0].gender).toBe('M');
    expect(animals[0].earring_number).toBe(1);
    expect(animals[0].breed).toBe('Nelore');
    expect(animals[0].date_birth).toStrictEqual(parseISO('2013-10-10'));
    expect(animals[0].animal_vaccines).toStrictEqual([]);
    expect(animals[0].operator_id).toBe(user.id);
    expect(animals[0].company_id).toBe(user.company_id);
  })

  it('should be able to recover the cache of animals when records are listed', async () => {
    const recoverCache = jest.spyOn(mockCacheProvider, 'recover');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await listAnimalsService.execute({
      operator_id: user.id,
    });

    expect(recoverCache).toHaveBeenCalledWith(
      `animals-list:${user.company_id}`
    );
  })

  it('should be able to save the cache of animals', async () => {
    const saveCache = jest.spyOn(mockCacheProvider, 'save');

    let user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    Object.assign(user, { company_id: user.id });

    user = await mockUsersRepository.save(user);

    await mockAnimalsRepository.create({
      name: 'Tim',
      gender: 'F',
      lactating: false,
      earring_number: 1,
      breed: 'Nelore',
      date_birth: parseISO('2013-10-10'),
      company_id: user.company_id,
      operator_id: user.id,
    });

    await listAnimalsService.execute({
      operator_id: user.id,
    });

    expect(saveCache).toHaveBeenCalled();
  });
})
