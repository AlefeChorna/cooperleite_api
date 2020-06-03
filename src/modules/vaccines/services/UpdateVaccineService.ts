import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IVaccineModel from '../models/IVaccineModel';
import IVaccinesRepository from '../repositories/IVaccinesRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  id: number;
  name: string;
  operator_id: string;
}

@injectable()
class UpdateVaccineService {
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

  public async execute({ id, name, operator_id }: IRequest): Promise<IVaccineModel> {
    const operator = await this.usersRepository.findById(operator_id);
    if (!operator) {
      throw new AppError('Operator not found', 422);
    }

    const vaccine = await this.vaccinesRepository.findById(id);
    if (!vaccine) {
      throw new AppError('Vaccine not found', 422);
    }

    Object.assign(vaccine, { name });

    const updatedVaccine = await this.vaccinesRepository.save(vaccine);

    await this.cacheProvider.delete(
      `vaccines-list:${operator.company_id}`
    );
    await this.cacheProvider.delete(
      `vaccine-show:${operator.company_id}:${updatedVaccine.id}`
    );

    return updatedVaccine;
  }
}

export default UpdateVaccineService;
