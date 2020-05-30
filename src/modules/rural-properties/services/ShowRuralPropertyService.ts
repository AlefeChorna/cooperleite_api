import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IRuralPropertyModel from '../models/IRuralPropertyModel';
import IRuralPropertiesRepository from '../repositories/IRuralPropertiesRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  operator_id: string;
  rural_property_id: number;
}

@injectable()
class ShowRuralPropertyService {
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

  public async execute({
    operator_id,
    rural_property_id
  }: IRequest): Promise<IRuralPropertyModel | undefined> {
    const operator = await this.usersRepository.findById(operator_id);

    if (!operator) {
      throw new AppError('Operator not found', 422);
    }

    const ruralPropertyCacheKey =
      `rural-property-show:${operator.company_id}:${rural_property_id}`;

    let ruralProperty = await this.cacheProvider.recover<IRuralPropertyModel>(
      ruralPropertyCacheKey
    );

    if (!ruralProperty) {
      ruralProperty = await this.ruralPropertiesRepository.findOne({
        id: rural_property_id,
        company_id: operator.company_id,
      });

      if (ruralProperty) {
        await this.cacheProvider.save(
          ruralPropertyCacheKey,
          ruralProperty
        );
      }
    }

    return ruralProperty;
  }
}

export default ShowRuralPropertyService;
