import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAnimalModel from '../models/IAnimalModel';
import IAnimalsRepository from '../repositories/IAnimalsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  operator_id: string;
  animal_id: number;
}

@injectable()
class ShowAnimalService {
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
    operator_id,
    animal_id
  }: IRequest): Promise<IAnimalModel | undefined> {
    const operator = await this.usersRepository.findById(operator_id);

    if (!operator) {
      throw new AppError('Operator not found', 422);
    }

    const animalCacheKey =
      `animal-show:${operator.company_id}:${animal_id}`;

    let animal = await this.cacheProvider.recover<IAnimalModel>(
      animalCacheKey
    );

    if (!animal) {
      animal = await this.animalsRepository.findOne({
        id: animal_id,
        company_id: operator.company_id,
      });

      if (animal) {
        await this.cacheProvider.save(animalCacheKey, animal);
      }
    }

    return animal;
  }
}

export default ShowAnimalService;
