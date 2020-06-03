import IRuralPropertyModel from '../models/IRuralPropertyModel';
import IFindOneRuralPropertyDTO from '../dtos/IFindOneRuralPropertyDTO';
import ICreateRuralPropertyDTO from '../dtos/ICreateRuralPropertyDTO';

export default interface IRuralPropertiesRepository {
  findOne(ruralProperty: IFindOneRuralPropertyDTO): Promise<IRuralPropertyModel | undefined>;
  findById(id: number): Promise<IRuralPropertyModel | undefined>;
  findByCompanyId(company_id: string): Promise<IRuralPropertyModel[] | undefined>;
  create(data: ICreateRuralPropertyDTO): Promise<IRuralPropertyModel>;
  save(ruralProperty: IRuralPropertyModel): Promise<IRuralPropertyModel>;
}
