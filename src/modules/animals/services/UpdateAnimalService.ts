import { injectable, inject, container } from 'tsyringe';
import { isValid, parseISO } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IAnimalModel, { IGender } from '../models/IAnimalModel';
import IAnimalsRepository from '../repositories/IAnimalsRepository';
import CreateAnimalVaccineService from './CreateAnimalVaccineService';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import genders from '@modules/animals/utils/genders';

interface IRequest {
  id: number;
  name?: string;
  gender?: string | IGender;
  breed?: string;
  weight?: number;
  earring_number?: number;
  lactating?: boolean;
  operator_id: string;
  date_birth?: Date;
  animal_vaccines?: {
    vaccine_id: number;
    applied_at: string;
    lack_at: string;
  }[]
}

@injectable()
class UpdateAnimalService {
  private animalsRepository: IAnimalsRepository;

  private usersRepository: IUsersRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('AnimalsRepository')
    animalsRepository: IAnimalsRepository,

    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.animalsRepository = animalsRepository;
    this.usersRepository = usersRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute({
    id,
    name,
    earring_number,
    gender,
    operator_id,
    breed,
    weight,
    lactating,
    date_birth,
    animal_vaccines
  }: IRequest): Promise<IAnimalModel> {
    const operator = await this.usersRepository.findById(operator_id);
    if (!operator) {
      throw new AppError('Operator not found', 422);
    }

    const animal = await this.animalsRepository.findById(id);
    if (!animal) {
      throw new AppError('Animal not found', 422);
    }

    if (gender) {
      const genderExists = genders.hasOwnProperty(gender || '');
      if (!genderExists) {
        throw new AppError('Animal gender not found', 422);
      }
    }

    const animalGender = gender || animal.gender;
    if (animalGender === genders.M && lactating) {
      throw new AppError(
        { gender: 'Animal do sexo macho não pode estar em lactação' },
        422
      );
    }

    if (date_birth) {
      const invalidDateBirth = !isValid(date_birth);

      if (invalidDateBirth) {
        throw new AppError(
          'Invalid date of birth. Date must be in the format yyyy-mm-dd',
          422
        );
      }
    }

    if (Number(earring_number) !== animal.earring_number) {
      const earringNumberAlreadyInUse = await this.animalsRepository.findOne({
        earring_number,
        company_id: operator.company_id,
      });

      if (earringNumberAlreadyInUse) {
        throw new AppError(
          { earring_number: 'Número do brinco já esta em uso' },
          422
        );
      }
    }

    Object.assign(animal, {
      name: name ?? animal.name,
      gender: gender ?? animal.gender,
      earring_number: earring_number ?? animal.earring_number,
      breed: breed ?? animal.breed,
      weight: weight ?? animal.weight,
      lactating: lactating  ?? animal.lactating,
      date_birth: date_birth ?? animal.date_birth,
    });

    const updatedAnimal = await this.animalsRepository.save(animal);

    await this.cacheProvider.delete(`animals-list:${operator.company_id}`);
    await this.cacheProvider.delete(
      `animal-show:${operator.company_id}:${updatedAnimal.id}`
    );

    if (animal_vaccines) {
      const createAnimalVaccineService = container.resolve(CreateAnimalVaccineService);

      for (const animal_vaccine of animal_vaccines) {
        const createdAnimalVaccine = await createAnimalVaccineService.execute({
          vaccine_id: animal_vaccine.vaccine_id,
          animal_id: updatedAnimal.id,
          applied_at: parseISO(animal_vaccine.applied_at),
          lack_at: parseISO(animal_vaccine.lack_at),
          operator_id: operator.id
        });
        updatedAnimal.animal_vaccines.push(createdAnimalVaccine);
      }
    }

    return updatedAnimal;
  }
}

export default UpdateAnimalService;
