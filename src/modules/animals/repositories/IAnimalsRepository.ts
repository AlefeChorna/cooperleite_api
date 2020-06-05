import IAnimalModel from '../models/IAnimalModel';
import IFindOneAnimalDTO from '../dtos/IFindOneAnimalDTO';
import ICreateAnimalDTO from '../dtos/ICreateAnimalDTO';

export default interface IAnimalsRepository {
  findOne(vaccine: IFindOneAnimalDTO): Promise<IAnimalModel | undefined>;
  findById(id: number): Promise<IAnimalModel | undefined>;
  findByCompanyId(company_id: string): Promise<IAnimalModel[] | undefined>;
  create(data: ICreateAnimalDTO): Promise<IAnimalModel>;
  save(vaccine: IAnimalModel): Promise<IAnimalModel>;
}
