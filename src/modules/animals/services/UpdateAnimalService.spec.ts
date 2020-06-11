import { parseISO } from 'date-fns';

import MockAnimalsRepository from '../repositories/mocks/MockAnimalsRepository';
import UpdateAnimalService from './UpdateAnimalService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import AppError from '@shared/errors/AppError';

let mockAnimalsRepository: MockAnimalsRepository;
let mockUsersRepository: MockUsersRepository;
let mockCacheProvider: MockCacheProvider;
let updateAnimalService: UpdateAnimalService;

describe('UpdateAnimalService', () => {
  beforeEach(() => {
    mockAnimalsRepository = new MockAnimalsRepository();
    mockUsersRepository = new MockUsersRepository();
    mockCacheProvider = new MockCacheProvider();
    updateAnimalService = new UpdateAnimalService(
      mockAnimalsRepository,
      mockUsersRepository,
      mockCacheProvider
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      updateAnimalService.execute({
        id: 1,
        name: 'Mimosa',
        gender: 'M',
        earring_number: 1,
        operator_id: 'non-existing-operator',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should throw an error if the animal is not found', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await expect(
      updateAnimalService.execute({
        id: 1,
        name: 'Mimosa',
        gender: 'M',
        earring_number: 1,
        operator_id: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should throw an error if is provided a invalid gender', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const animal = await mockAnimalsRepository.create({
      name: 'Mimosa',
      gender: 'Ms',
      earring_number: 1,
      company_id: user.company_id,
      operator_id: user.id,
    });

    await expect(
      updateAnimalService.execute({
        id: animal.id,
        name: 'Mimosa 2',
        gender: 'Ms',
        operator_id: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should throw an error if the gender is male and is lactating', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const animal = await mockAnimalsRepository.create({
      name: 'Mimosa',
      gender: 'M',
      earring_number: 1,
      company_id: user.company_id,
      operator_id: user.id,
    });

    await expect(
      updateAnimalService.execute({
        id: animal.id,
        lactating: true,
        operator_id: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should throw an error if is provided a invalid date of birth', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const animal = await mockAnimalsRepository.create({
      name: 'Mimosa',
      gender: 'M',
      earring_number: 1,
      company_id: user.company_id,
      operator_id: user.id,
    });

    await expect(
      updateAnimalService.execute({
        id: animal.id,
        date_birth: 'invalid-date',
        operator_id: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should throw an error if earring number is already in use', async () => {
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
      company_id: user.company_id,
      operator_id: user.id,
    });

    const animal = await mockAnimalsRepository.create({
      name: 'Mimosa',
      gender: 'F',
      earring_number: 2,
      breed: 'Braford',
      company_id: user.company_id,
      operator_id: user.id,
    });

    await expect(
      updateAnimalService.execute({
        id: animal.id,
        earring_number: 1,
        operator_id: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to update a male animal', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    const animal = await mockAnimalsRepository.create({
      name: 'Mimosa',
      gender: 'M',
      earring_number: 1,
      company_id: user.company_id,
      operator_id: user.id,
    });

    const updatedAnimal = await updateAnimalService.execute({
      id: animal.id,
      name: 'Tim',
      gender: 'M',
      earring_number: 1,
      breed: 'Nelore',
      date_birth: '2013-10-10',
      operator_id: user.id,
    });

    expect(updatedAnimal.id).toBe(animal.id);
    expect(updatedAnimal.name).toBe('Tim');
    expect(updatedAnimal.gender).toBe('M');
    expect(updatedAnimal.earring_number).toBe(1);
    expect(updatedAnimal.breed).toBe('Nelore');
    expect(updatedAnimal.date_birth).toStrictEqual(parseISO('2013-10-10'));
    expect(updatedAnimal.operator_id).toBe(user.id);
    expect(updatedAnimal.company_id).toBe(user.company_id);
  })

  it('should be able to update a feminine animal', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    const animal = await mockAnimalsRepository.create({
      name: 'Mimosa',
      gender: 'F',
      earring_number: 1,
      breed: 'Braford',
      weight: 600,
      lactating: true,
      date_birth: '2010-01-01',
      company_id: user.company_id,
      operator_id: user.id,
    });

    const updatedAnimal = await updateAnimalService.execute({
      id: animal.id,
      name: 'Mimosa 2',
      gender: 'F',
      earring_number: 10,
      breed: 'Nelore',
      weight: 700,
      lactating: true,
      date_birth: '2013-01-01',
      operator_id: user.id,
    });

    expect(updatedAnimal.id).toBe(animal.id);
    expect(updatedAnimal.name).toBe('Mimosa 2');
    expect(updatedAnimal.gender).toBe('F');
    expect(updatedAnimal.earring_number).toBe(10);
    expect(updatedAnimal.breed).toBe('Nelore');
    expect(updatedAnimal.date_birth).toStrictEqual(parseISO('2013-01-01'));
    expect(updatedAnimal.lactating).toBe(true);
    expect(updatedAnimal.weight).toBe(700);
    expect(updatedAnimal.operator_id).toBe(user.id);
    expect(updatedAnimal.company_id).toBe(user.company_id);
  })

  it('should be able to delete animals cache when a record is updated', async () => {
    const deleteCache = jest.spyOn(mockCacheProvider, 'delete');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const animal = await mockAnimalsRepository.create({
      name: 'Mimosa',
      gender: 'M',
      earring_number: 1,
      company_id: user.company_id,
      operator_id: user.id,
    });

    await updateAnimalService.execute({
      id: animal.id,
      name: 'Mimosa',
      gender: 'F',
      earring_number: 1,
      operator_id: user.id,
    });

    expect(deleteCache).toHaveBeenCalledTimes(2);
  })
})
