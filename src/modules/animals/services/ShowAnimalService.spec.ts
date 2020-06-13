import { parseISO } from 'date-fns';

import MockAnimalsRepository from '../repositories/mocks/MockAnimalsRepository';
import ShowAnimalService from './ShowAnimalService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import AppError from '@shared/errors/AppError';

let mockAnimalsRepository: MockAnimalsRepository;
let mockUsersRepository: MockUsersRepository;
let mockCacheProvider: MockCacheProvider;
let showAnimalService: ShowAnimalService;

describe('ShowAnimalService', () => {
  beforeEach(() => {
    mockAnimalsRepository = new MockAnimalsRepository();
    mockUsersRepository = new MockUsersRepository();
    mockCacheProvider = new MockCacheProvider();
    showAnimalService = new ShowAnimalService(
      mockAnimalsRepository,
      mockUsersRepository,
      mockCacheProvider
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      showAnimalService.execute({
        operator_id: 'non-existing-operator',
        animal_id: 1
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should return undefined if a animal is not found', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const animal = await showAnimalService.execute({
      operator_id: user.id,
      animal_id: 1
    });

    expect(animal).toBe(undefined);
  })

  it('should be able to show a animal', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const animal = await mockAnimalsRepository.create({
      name: 'Mimosa',
      gender: 'M',
      earring_number: 1,
      breed: 'Nelore',
      date_birth: parseISO('2013-10-10'),
      company_id: user.company_id,
      operator_id: user.id,
    });

    const animalFound = await showAnimalService.execute({
      operator_id: user.id,
      animal_id: animal.id,
    });

    expect(animalFound?.id).toBe(animal.id);
    expect(animalFound?.name).toBe('Mimosa');
    expect(animalFound?.gender).toBe('M');
    expect(animalFound?.earring_number).toBe(1);
    expect(animalFound?.breed).toBe('Nelore');
    expect(animalFound?.animal_vaccines).toStrictEqual([]);
    expect(animalFound?.date_birth).toStrictEqual(parseISO('2013-10-10'));
    expect(animalFound?.operator_id).toBe(user.id);
    expect(animalFound?.company_id).toBe(user.company_id);
  })

  it('should be able to recover the cache of animal when the record is showed', async () => {
    const recoverCache = jest.spyOn(mockCacheProvider, 'recover');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await showAnimalService.execute({
      operator_id: user.id,
      animal_id: 1,
    });

    expect(recoverCache).toHaveBeenCalledWith(
      `animal-show:${user.company_id}:1`
    );
  });

  it('should be able to save the cache of animal', async () => {
    const saveCache = jest.spyOn(mockCacheProvider, 'save');

    let user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    Object.assign(user, { company_id: user.id });

    user = await mockUsersRepository.save(user);

    const animal = await mockAnimalsRepository.create({
      name: 'Mimosa',
      gender: 'M',
      earring_number: 1,
      breed: 'Nelore',
      date_birth: parseISO('2013-10-10'),
      company_id: user.company_id,
      operator_id: user.id,
    });

    await showAnimalService.execute({
      operator_id: user.id,
      animal_id: animal.id,
    });

    expect(saveCache).toHaveBeenCalled();
  });
})
