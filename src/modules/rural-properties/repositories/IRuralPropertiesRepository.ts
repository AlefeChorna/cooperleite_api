import IRuralPropertyModel from '../models/IRuralPropertyModel';
import ICreateRuralProperty from '../dtos/ICreateRuralProperty';

interface IRuralPropertyParams {
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
  findOne(ruralProperty: IRuralPropertyParams): Promise<IRuralPropertyModel | undefined>;
  findById(id: number): Promise<IRuralPropertyModel | undefined>;
  findByCompanyId(company_id: string): Promise<IRuralPropertyModel[] | undefined>;
  create(data: ICreateRuralProperty): Promise<IRuralPropertyModel>;
  save(ruralProperty: IRuralPropertyModel): Promise<IRuralPropertyModel>;
}
