import IVaccineModel from '../models/IVaccineModel';
import ICreateVaccineDTO from '../dtos/ICreateVaccineDTO';

export interface IFindVaccineParams {
  id?: number;
  name?: string;
  company_id?: string;
  operator_id?: string;
  created_at?: string;
  updated_at?: string;
}

export default interface IVaccinesRepository {
  findOne(vaccine: IFindVaccineParams): Promise<IVaccineModel | undefined>;
  findById(id: number): Promise<IVaccineModel | undefined>;
  findByCompanyId(company_id: string): Promise<IVaccineModel[] | undefined>;
  create(data: ICreateVaccineDTO): Promise<IVaccineModel>;
  save(vaccine: IVaccineModel): Promise<IVaccineModel>;
}
