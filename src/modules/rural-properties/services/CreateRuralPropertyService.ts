import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IRuralPropertyModel from '../models/IRuralPropertyModel';
import IRuralPropertiesRepository from '../repositories/IRuralPropertiesRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  name: string;
  city: string;
  state: string;
  operator_id: string;
}

@injectable()
class CreateRuralPrepertyService {
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

  public async execute({ name, city, state, operator_id }: IRequest): Promise<IRuralPropertyModel> {
    const operator = await this.usersRepository.findById(operator_id);

    if (!operator) {
      throw new AppError('Operator not found', 422);
    }

    const ruralProperty = await this.ruralPropertiesRepository.create({
      name,
      city,
      state,
      operator_id,
      company_id: operator.company_id
    });

    await this.cacheProvider.delete(
      `rural-properties-show:${operator.company_id}`
    );

    return ruralProperty;
  }
}

export default CreateRuralPrepertyService;
