import 'reflect-metadata';
import { parseISO } from 'date-fns';

import { container } from 'tsyringe';

import MockAnimalsRepository from '../repositories/mocks/MockAnimalsRepository';
import MockAnimalVaccinesRepository from '../repositories/mocks/MockAnimalVaccinesRepository';
import UpdateAnimalService from './UpdateAnimalService';
import CreateAnimalVaccineService from './CreateAnimalVaccineService';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockVaccinesRepository from '@modules/vaccines/repositories/mocks/MockVaccinesRepository';
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
        date_birth: parseISO('invalid-date'),
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

    const mockAnimalVaccinesRepository = new MockAnimalVaccinesRepository();
    const mockVaccinesRepository = new MockVaccinesRepository();
    jest.spyOn(container, 'resolve').mockReturnValue(
      new CreateAnimalVaccineService(
        mockAnimalVaccinesRepository,
        mockUsersRepository,
        mockVaccinesRepository,
      )
    );

    const vaccine = await mockVaccinesRepository.create({
      name: 'Aftosa',
      company_id: user.company_id,
      operator_id: user.id,
    });

    const updatedAnimal = await updateAnimalService.execute({
      id: animal.id,
      name: 'Tim',
      gender: 'M',
      earring_number: 1,
      breed: 'Nelore',
      date_birth: parseISO('2013-10-10'),
      animal_vaccines: [{
        vaccine_id: vaccine.id,
        applied_at: '2015-01-01',
        lack_at: '2015-06-01',
      }],
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

    const {
      animal_id,
      vaccine_id,
      applied_at,
      lack_at,
      company_id,
      operator_id,
    } = updatedAnimal.animal_vaccines[0];

    expect(animal_id).toBe(updatedAnimal.id);
    expect(vaccine_id).toBe(vaccine.id);
    expect(applied_at).toStrictEqual(parseISO('2015-01-01'));
    expect(lack_at).toStrictEqual(parseISO('2015-06-01'));
    expect(company_id).toBe(user.company_id);
    expect(operator_id).toBe(user.id);
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
      date_birth: parseISO('2010-01-01'),
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
      date_birth: parseISO('2013-01-01'),
      operator_id: user.id,
    });

    expect(updatedAnimal.id).toBe(animal.id);
    expect(updatedAnimal.name).toBe('Mimosa 2');
    expect(updatedAnimal.gender).toBe('F');
    expect(updatedAnimal.earring_number).toBe(10);
    expect(updatedAnimal.breed).toBe('Nelore');
    expect(updatedAnimal.date_birth).toStrictEqual(parseISO('2013-01-01'));
    expect(updatedAnimal.animal_vaccines).toStrictEqual([]);
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
