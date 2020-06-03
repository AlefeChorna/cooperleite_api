import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IVaccineModel from '../models/IVaccineModel';
import IVaccinesRepository from '../repositories/IVaccinesRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  operator_id: string;
  vaccine_id: number;
}

@injectable()
class ShowVaccineService {
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

  public async execute({
    operator_id,
    vaccine_id
  }: IRequest): Promise<IVaccineModel | undefined> {
    const operator = await this.usersRepository.findById(operator_id);

    if (!operator) {
      throw new AppError('Operator not found', 422);
    }

    const vaccineCacheKey = `vaccine-show:${operator.company_id}:1`;

    let vaccine = await this.cacheProvider.recover<IVaccineModel>(
      vaccineCacheKey
    );

    if (!vaccine) {
      vaccine = await this.vaccinesRepository.findOne({
        id: vaccine_id,
        company_id: operator.company_id,
      });

      if (vaccine) {
        await this.cacheProvider.save(vaccineCacheKey, vaccine);
      }
    }

    return vaccine;
  }
}

export default ShowVaccineService;
