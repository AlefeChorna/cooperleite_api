import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IRuralPropertyModel from '../models/IRuralPropertyModel';
import IRuralPropertiesRepository from '../repositories/IRuralPropertiesRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  operator_id: string;
}

@injectable()
class ListRuralPropertiesService {
  private ruralPropertiesRepository: IRuralPropertiesRepository;

  private usersRepository: IUsersRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('RuralPropertiesRepository')
    ruralPropertiesRepository: IRuralPropertiesRepository,

    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.ruralPropertiesRepository = ruralPropertiesRepository;
    this.usersRepository = usersRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute(
    { operator_id }: IRequest
  ): Promise<IRuralPropertyModel[] | []> {
    const operator = await this.usersRepository.findById(operator_id);

    if (!operator) {
      throw new AppError('Operator not found', 422);
    }

    let ruralProperties = await this.cacheProvider.recover<IRuralPropertyModel[]>(
      `rural-properties-list:${operator.company_id}`
    );

    if (!ruralProperties) {
      ruralProperties = await this.ruralPropertiesRepository.findByCompanyId(
        operator.company_id
      );
    }

    if (!ruralProperties) return [];

    return ruralProperties;
  }
}

export default ListRuralPropertiesService;
