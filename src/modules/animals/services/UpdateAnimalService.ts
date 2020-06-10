import { injectable, inject } from 'tsyringe';
import { isValid, parseISO } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IAnimalModel, { IGender } from '../models/IAnimalModel';
import IAnimalsRepository from '../repositories/IAnimalsRepository';
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
  date_birth?: string;
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
    date_birth
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
      throw new AppError('Male animals do not go into lactose', 422);
    }

    if (date_birth) {
      const parsedDateBirth = parseISO(date_birth);
      const invalidDateBirth = date_birth && !isValid(parsedDateBirth);

      if (invalidDateBirth) {
        throw new AppError(
          'Invalid date of birth. Date must be in the format yyyy-mm-dd',
          422
        );
      }
    }

    if (earring_number !== animal.earring_number) {
      const earringNumberAlreadyInUse = await this.animalsRepository.findOne({
        earring_number,
        company_id: operator.company_id,
      });

      if (earringNumberAlreadyInUse) {
        throw new AppError(
          'Earring number is already in use',
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
      date_birth: date_birth ? parseISO(date_birth) : animal.date_birth,
    });

    const updatedAnimal = await this.animalsRepository.create(animal);

    await this.cacheProvider.delete(`animals-list:${operator.company_id}`);

    return updatedAnimal;
  }
}

export default UpdateAnimalService;
