import IRuralPropertyModel from '../models/IRuralPropertyModel';
import ICreateRuralPropertyDTO from '../dtos/ICreateRuralPropertyDTO';

export interface IFindRuralPropertyParams {
  id?: number;
  name?: string;
  city?: string;
  state?: string;
  company_id?: string;
  operator_id?: string;
  created_at?: string;
  updated_at?: string;
}

export default interface IRuralPropertiesRepository {
  findOne(ruralProperty: IFindRuralPropertyParams): Promise<IRuralPropertyModel | undefined>;
  findById(id: number): Promise<IRuralPropertyModel | undefined>;
  findByCompanyId(company_id: string): Promise<IRuralPropertyModel[] | undefined>;
  create(data: ICreateRuralPropertyDTO): Promise<IRuralPropertyModel>;
  save(ruralProperty: IRuralPropertyModel): Promise<IRuralPropertyModel>;
}
