import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAnimalModel from '../models/IAnimalModel';
import IAnimalsRepository from '../repositories/IAnimalsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  operator_id: string;
}

@injectable()
class ListAnimalsService {
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

  public async execute(
    { operator_id }: IRequest
  ): Promise<IAnimalModel[] | []> {
    const operator = await this.usersRepository.findById(operator_id);

    if (!operator) {
      throw new AppError('Operator not found', 422);
    }

    const animalsCacheKey = `animals-list:${operator.company_id}`;

    let animals = await this.cacheProvider.recover<IAnimalModel[]>(
      animalsCacheKey
    );

    if (!animals) {
      animals = await this.animalsRepository.findByCompanyId(
        operator.company_id
      );

      if (animals) {
        await this.cacheProvider.save(animalsCacheKey, animals);
      }
    }

    return animals || [];
  }
}

export default ListAnimalsService;
