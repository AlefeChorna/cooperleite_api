import IAnimalVaccineModel from '../models/IAnimalVaccineModel';
import ICreateAnimalVaccineDTO from '../dtos/ICreateAnimalVaccineDTO';

export default interface IAnimalVaccinesRepository {
  findById(id: number): Promise<IAnimalVaccineModel | undefined>;
  create(data: ICreateAnimalVaccineDTO): Promise<IAnimalVaccineModel>;
  save(animalVaccine: IAnimalVaccineModel): Promise<IAnimalVaccineModel>;
}
