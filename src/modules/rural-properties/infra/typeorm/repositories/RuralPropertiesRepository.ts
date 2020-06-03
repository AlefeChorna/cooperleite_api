import { getRepository, Repository } from 'typeorm';

import IRuralPropertiesRepository from '@modules/rural-properties/repositories/IRuralPropertiesRepository';
import IRuralPropertyModel from '@modules/rural-properties/models/IRuralPropertyModel';
import IFindOneRuralPropertyDTO from '@modules/rural-properties/dtos/IFindOneRuralPropertyDTO';
import ICreateRuralPropertyDTO from '@modules/rural-properties/dtos/ICreateRuralPropertyDTO';
import RuralProperty from '../entities/RuralProperty';

class RuralPropertiesRepository implements IRuralPropertiesRepository {
  private ormRepository: Repository<RuralProperty>;

  constructor() {
    this.ormRepository = getRepository(RuralProperty);
  }

  public async findOne(
    data: IFindOneRuralPropertyDTO
  ): Promise<IRuralPropertyModel | undefined> {
    const ruralProperty = await this.ormRepository.findOne(data);

    return ruralProperty;
  }

  public async findById(id: number): Promise<IRuralPropertyModel | undefined> {
    const ruralProperty = await this.ormRepository.findOne(id);

    return ruralProperty;
  }

  public async findByCompanyId(
    company_id: string
  ): Promise<IRuralPropertyModel[] | undefined> {
    const ruralProperties = await this.ormRepository.find({ company_id });

    return ruralProperties;
  }

  public async create(data: ICreateRuralPropertyDTO): Promise<IRuralPropertyModel> {
    const ruralProperty = this.ormRepository.create(data);

    await this.ormRepository.save(ruralProperty);

    return ruralProperty;
  }

  public async save(ruralProperty: IRuralPropertyModel): Promise<IRuralPropertyModel> {
    return await this.ormRepository.save(ruralProperty);
  }
}

export default RuralPropertiesRepository
