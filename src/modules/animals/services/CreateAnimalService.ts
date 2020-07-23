import { injectable, inject } from 'tsyringe';
import { isValid } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IAnimalModel, { IGender } from '../models/IAnimalModel';
import IAnimalsRepository from '../repositories/IAnimalsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import genders from '@modules/animals/utils/genders';

interface IRequest {
  name: string;
  gender: string | IGender;
  breed?: string;
  weight?: number;
  earring_number: number;
  lactating?: boolean;
  operator_id: string;
  date_birth?: Date;
}

@injectable()
class CreateAnimalService {
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

    const genderExists = genders.hasOwnProperty(gender);
    if (!genderExists) {
      throw new AppError('Animal gender not found', 422);
    }

    if (gender === genders.M && lactating) {
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

    const animalData = {
      name,
      gender,
      earring_number,
      lactating: !!lactating,
      company_id: operator.company_id,
      operator_id: operator.id
    }

    if (breed) {
      Object.assign(animalData, { breed })
    }

    if (weight) {
      Object.assign(animalData, { weight })
    }

    if (date_birth) {
      Object.assign(animalData, { date_birth })
    }

    const animal = await this.animalsRepository.create(animalData);

    await this.cacheProvider.delete(
      `animals-list:${operator.company_id}`
    );

    return animal;
  }
}

export default CreateAnimalService;
