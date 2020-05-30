import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IRuralPropertyModel from '../models/IRuralPropertyModel';
import IRuralPropertiesRepository from '../repositories/IRuralPropertiesRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  id: number;
  name: string;
  city: string;
  state: string;
  operator_id: string;
}

@injectable()
class UpdateRuralPropertyService {
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

  public async execute({ id, name, city, state, operator_id }: IRequest): Promise<IRuralPropertyModel> {
    const operator = await this.usersRepository.findById(operator_id);
    if (!operator) {
      throw new AppError('Operator not found', 422);
    }

    const ruralProperty = await this.ruralPropertiesRepository.findById(id);
    if (!ruralProperty) {
      throw new AppError('Rural property not found', 422);
    }

    Object.assign(ruralProperty, {
      name,
      city,
      state,
    });

    const updatedRuralProperty = await this.ruralPropertiesRepository.save(
      ruralProperty,
    );

    await this.cacheProvider.delete(
      `rural-properties-list:${operator.company_id}`
    );
    await this.cacheProvider.delete(
      `rural-property-show:${operator.company_id}:${updatedRuralProperty.id}`
    );

    return updatedRuralProperty;
  }
}

export default UpdateRuralPropertyService;
