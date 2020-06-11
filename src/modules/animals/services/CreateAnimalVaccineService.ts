import { injectable, inject } from 'tsyringe';
import { isValid } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IAnimalVaccineModel from '../models/IAnimalVaccineModel';
import IAnimalVaccinesRepository from '../repositories/IAnimalVaccinesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IVaccinesRepository from '@modules/vaccines/repositories/IVaccinesRepository';

interface IRequest {
  vaccine_id: number;
  animal_id: number;
  applied_at: Date;
  lack_at: Date;
  operator_id: string;
}

@injectable()
class CreateAnimalService {
  private animalVaccinesRepository: IAnimalVaccinesRepository;

  private usersRepository: IUsersRepository;

  private vaccinesRepository: IVaccinesRepository;

  constructor(
    @inject('AnimalVaccinesRepository')
    animalVaccinesRepository: IAnimalVaccinesRepository,

    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('VaccinesRepository')
    vaccinesRepository: IVaccinesRepository,
  ) {
    this.animalVaccinesRepository = animalVaccinesRepository;
    this.usersRepository = usersRepository;
    this.vaccinesRepository = vaccinesRepository;
  }

  public async execute({
    vaccine_id,
    animal_id,
    applied_at,
    lack_at,
    operator_id
  }: IRequest): Promise<IAnimalVaccineModel> {
    const operator = await this.usersRepository.findById(operator_id);
    if (!operator) {
      throw new AppError('Operator not found', 422);
    }

    const vaccine = await this.vaccinesRepository.findById(vaccine_id);
    if (!vaccine) {
      throw new AppError('Vaccine not found', 422);
    }

    const invalidAppliedAt = !isValid(applied_at);
    if (invalidAppliedAt) {
      throw new AppError(
        'Invalid applied date. Date must be in the format yyyy-mm-dd',
        422
      );
    }

    const invalidLackAt = !isValid(lack_at);
    if (invalidLackAt) {
      throw new AppError(
        'Invalid lack date. Date must be in the format yyyy-mm-dd',
        422
      );
    }

    const animalVaccine = await this.animalVaccinesRepository.create({
      vaccine_id,
      animal_id,
      applied_at,
      lack_at,
      company_id: operator.company_id,
      operator_id: operator.id,
    });

    return animalVaccine;
  }
}

export default CreateAnimalService;
