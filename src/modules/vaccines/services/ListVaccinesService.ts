import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IVaccineModel from '../models/IVaccineModel';
import IVaccinesRepository from '../repositories/IVaccinesRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  operator_id: string;
}

@injectable()
class ListVaccinesService {
  private vaccinesRepository: IVaccinesRepository;

  private usersRepository: IUsersRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('VaccinesRepository')
    vaccinesRepository: IVaccinesRepository,

    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.vaccinesRepository = vaccinesRepository;
    this.usersRepository = usersRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute(
    { operator_id }: IRequest
  ): Promise<IVaccineModel[] | []> {
    const operator = await this.usersRepository.findById(operator_id);

    if (!operator) {
      throw new AppError('Operator not found', 422);
    }

    const vaccinesCacheKey = `vaccines-list:${operator.company_id}`;

    let vaccines = await this.cacheProvider.recover<IVaccineModel[]>(
      vaccinesCacheKey
    );

    if (!vaccines) {
      vaccines = await this.vaccinesRepository.findByCompanyId(
        operator.company_id
      );

      if (vaccines) {
        await this.cacheProvider.save(
          vaccinesCacheKey,
          vaccines
        );
      }
    }

    return vaccines || [];
  }
}

export default ListVaccinesService;
