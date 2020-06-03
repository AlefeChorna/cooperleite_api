import IVaccineModel from '../models/IVaccineModel';
import IFindOneVaccineDTO from '../dtos/IFindOneVaccineDTO';
import ICreateVaccineDTO from '../dtos/ICreateVaccineDTO';

export default interface IVaccinesRepository {
  findOne(vaccine: IFindOneVaccineDTO): Promise<IVaccineModel | undefined>;
  findById(id: number): Promise<IVaccineModel | undefined>;
  findByCompanyId(company_id: string): Promise<IVaccineModel[] | undefined>;
  create(data: ICreateVaccineDTO): Promise<IVaccineModel>;
  save(vaccine: IVaccineModel): Promise<IVaccineModel>;
}
