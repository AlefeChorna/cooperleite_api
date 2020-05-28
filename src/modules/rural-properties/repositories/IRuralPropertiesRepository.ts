import IRuralPropertyModel from '../models/IRuralPropertyModel';
import ICreateRuralProperty from '../dtos/ICreateRuralProperty';

export default interface IRuralPropertiesRepository {
  findById(id: number): Promise<IRuralPropertyModel | undefined>;
  findByCompanyId(company_id: string): Promise<IRuralPropertyModel[] | undefined>;
  create(data: ICreateRuralProperty): Promise<IRuralPropertyModel>;
  save(ruralProperty: IRuralPropertyModel): Promise<IRuralPropertyModel>;
}
