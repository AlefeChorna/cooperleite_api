import { parseISO } from 'date-fns';

import MockAnimalVaccinesRepository from '../repositories/mocks/MockAnimalVaccinesRepository';
import MockAnimalsRepository from '../repositories/mocks/MockAnimalsRepository';
import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockVaccinesRepository from '@modules/vaccines/repositories/mocks/MockVaccinesRepository';
import CreateAnimalVaccineService from './CreateAnimalVaccineService';
import AppError from '@shared/errors/AppError';

let mockAnimalVaccinesRepository: MockAnimalVaccinesRepository;
let mockUsersRepository: MockUsersRepository;
let mockAnimalsRepository: MockAnimalsRepository;
let mockVaccinesRepository: MockVaccinesRepository;
let createAnimalVaccineService: CreateAnimalVaccineService;

describe('CreateAnimalVaccineService', () => {
  beforeEach(() => {
    mockAnimalVaccinesRepository = new MockAnimalVaccinesRepository();
    mockUsersRepository = new MockUsersRepository();
    mockAnimalsRepository = new MockAnimalsRepository();
    mockVaccinesRepository = new MockVaccinesRepository();
    createAnimalVaccineService = new CreateAnimalVaccineService(
      mockAnimalVaccinesRepository,
      mockUsersRepository,
      mockVaccinesRepository,
    );
  })

  it('should throw an error if the operator is not found', async () => {
    await expect(
      createAnimalVaccineService.execute({
        vaccine_id: 1,
        animal_id: 1,
        applied_at: parseISO('2020-06-11'),
        lack_at: parseISO('2020-12-11'),
        operator_id: 'non-existing-operator',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should throw an error if the vaccine is not found', async () => {
    await expect(
      createAnimalVaccineService.execute({
        vaccine_id: 1,
        animal_id: 1,
        applied_at: parseISO('2020-06-11'),
        lack_at: parseISO('2020-12-11'),
        operator_id: 'non-existing-operator',
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should throw an error if is provided a invalid applied_at date', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const vaccine = await mockVaccinesRepository.create({
      name: 'Fetosa',
      operator_id: user.id,
      company_id: user.company_id,
    });

    await expect(
      createAnimalVaccineService.execute({
        vaccine_id: vaccine.id,
        animal_id: 1,
        applied_at: parseISO('invalid-date'),
        lack_at: parseISO('2020-12-11'),
        operator_id: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should throw an error if is provided a invalid lack_at date', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456',
    });

    const vaccine = await mockVaccinesRepository.create({
      name: 'Fetosa',
      operator_id: user.id,
      company_id: user.company_id,
    });

    await expect(
      createAnimalVaccineService.execute({
        vaccine_id: vaccine.id,
        animal_id: 1,
        applied_at: parseISO('2020-12-11'),
        lack_at: parseISO('invalid-date'),
        operator_id: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to create a new animal vaccine', async () => {
    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    const vaccine = await mockVaccinesRepository.create({
      name: 'Fetosa',
      operator_id: user.id,
      company_id: user.company_id,
    });

    const animal = await mockAnimalsRepository.create({
      name: 'Tim',
      gender: 'M',
      earring_number: 1,
      breed: 'Nelore',
      date_birth: '2013-10-10',
      operator_id: user.id,
      company_id: user.company_id,
    });

    const animalVaccine = await createAnimalVaccineService.execute({
      vaccine_id: vaccine.id,
      animal_id: animal.id,
      applied_at: parseISO('2020-06-11'),
      lack_at: parseISO('2020-12-11'),
      operator_id: user.id
    })

    expect(animalVaccine).toHaveProperty('id');
    expect(animalVaccine.vaccine_id).toBe(vaccine.id);
    expect(animalVaccine.animal_id).toBe(animal.id);
    expect(animalVaccine.applied_at).toStrictEqual(parseISO('2020-06-11'));
    expect(animalVaccine.lack_at).toStrictEqual(parseISO('2020-12-11'));
    expect(animalVaccine.operator_id).toBe(user.id);
    expect(animalVaccine.company_id).toBe(user.company_id);
  })
})
