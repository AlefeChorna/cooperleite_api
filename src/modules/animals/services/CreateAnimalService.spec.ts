import { parseISO } from 'date-fns';

import MockAnimalsRepository from '../repositories/mocks/MockAnimalsRepository';
import CreateVaccineService from './CreateAnimalService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import AppError from '@shared/errors/AppError';

let mockAnimalsRepository: MockAnimalsRepository;
let mockUsersRepository: MockUsersRepository;
let mockCacheProvider: MockCacheProvider;
let createVaccineService: CreateVaccineService;

describe('CreateAnimalService', () => {
  beforeEach(() => {
    mockAnimalsRepository = new MockAnimalsRepository();
    mockUsersRepository = new MockUsersRepository();
    mockCacheProvider = new MockCacheProvider();
    createVaccineService = new CreateVaccineService(
      mockAnimalsRepository,
      mockUsersRepository,
      mockCacheProvider
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      createVaccineService.execute({
        name: 'Mimosa',
        gender: 'M',
        earring_number: 1,
        operator_id: 'non-existing-operator',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should throw an error if is provided a invalid gender', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await expect(
      createVaccineService.execute({
        name: 'Mimosa',
        gender: 'Ms',
        earring_number: 1,
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

    await expect(
      createVaccineService.execute({
        name: 'Mimosa',
        gender: 'M',
        lactating: true,
        earring_number: 1,
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

    await expect(
      createVaccineService.execute({
        name: 'Mimosa',
        gender: 'M',
        date_birth: 'invalid-date',
        earring_number: 1,
        operator_id: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to create a new male animal', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    const animal = await createVaccineService.execute({
      name: 'Tim',
      gender: 'M',
      earring_number: 1,
      breed: 'Nelore',
      date_birth: '2013-10-10',
      operator_id: user.id,
    });

    expect(animal).toHaveProperty('id');
    expect(animal.name).toBe('Tim');
    expect(animal.gender).toBe('M');
    expect(animal.earring_number).toBe(1);
    expect(animal.breed).toBe('Nelore');
    expect(animal.date_birth).toStrictEqual(parseISO('2013-10-10'));
    expect(animal.operator_id).toBe(user.id);
    expect(animal.company_id).toBe(user.company_id);
  })

  it('should be able to create a new feminine animal', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    const animal = await createVaccineService.execute({
      name: 'Mimosa',
      gender: 'F',
      earring_number: 1,
      breed: 'Braford',
      weight: 600,
      lactating: true,
      date_birth: '2010-01-01',
      operator_id: user.id,
    });

    expect(animal).toHaveProperty('id');
    expect(animal.name).toBe('Mimosa');
    expect(animal.gender).toBe('F');
    expect(animal.earring_number).toBe(1);
    expect(animal.breed).toBe('Braford');
    expect(animal.date_birth).toStrictEqual(parseISO('2010-01-01'));
    expect(animal.lactating).toBe(true);
    expect(animal.weight).toBe(600);
    expect(animal.operator_id).toBe(user.id);
    expect(animal.company_id).toBe(user.company_id);
  })

  it('should be able to delete animals cache when a new record is created', async () => {
    const deleteCache = jest.spyOn(mockCacheProvider, 'delete');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    await createVaccineService.execute({
      name: 'Mimosa',
      gender: 'M',
      earring_number: 1,
      operator_id: user.id,
    });

    expect(deleteCache).toHaveBeenCalled();
  })
})
