import { getRepository, Repository } from 'typeorm';

import IVaccinesRepository from '@modules/vaccines/repositories/IVaccinesRepository';
import IVaccineModel from '@modules/vaccines/models/IVaccineModel';
import IFindOneVaccineDTO from '@modules/vaccines/dtos/IFindOneVaccineDTO';
import ICreateVaccineDTO from '@modules/vaccines/dtos/ICreateVaccineDTO';
import Vaccine from '../entities/Vaccine';

class VaccinesRepository implements IVaccinesRepository {
  private ormRepository: Repository<Vaccine>;

  constructor() {
    this.ormRepository = getRepository(Vaccine);
  }

  public async findOne(
    data: IFindOneVaccineDTO
  ): Promise<IVaccineModel | undefined> {
    const vaccine = await this.ormRepository.findOne(data);

    return vaccine;
  }

  public async findById(id: number): Promise<IVaccineModel | undefined> {
    const vaccine = await this.ormRepository.findOne(id);

    return vaccine;
  }

  public async findByCompanyId(
    company_id: string
  ): Promise<IVaccineModel[] | undefined> {
    const vaccines = await this.ormRepository.find({ company_id });

    return vaccines;
  }

  public async create(data: ICreateVaccineDTO): Promise<IVaccineModel> {
    const vaccine = this.ormRepository.create(data);

    await this.ormRepository.save(vaccine);

    return vaccine;
  }

  public async save(vaccine: IVaccineModel): Promise<IVaccineModel> {
    return await this.ormRepository.save(vaccine);
  }
}

export default VaccinesRepository
